// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use async_once::AsyncOnce;
use base64ct::{Base64, Encoding};
use chrono::Local;
use directories::BaseDirs;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use surrealdb::{
    engine::local::{Db, RocksDb},
    RecordId, Surreal,
};

lazy_static! {
    pub static ref DIR: String = format!(
        "{}/Ough",
        BaseDirs::new().unwrap().cache_dir().display().to_string()
    );
    pub static ref DB: AsyncOnce<Surreal<Db>> = AsyncOnce::new(async {
        Surreal::new::<RocksDb>(format!("{}/db", DIR.as_str()).as_str())
            .await
            .unwrap()
    });
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Members {
    pub issue_date: String,
    pub member_id: u32,
    pub image: String,
    pub name: String,
    pub birthday: String,
    pub address: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct FMembers {
    pub name: String,
    pub birthday: String,
    pub address: String,
}

#[tauri::command]
async fn greet(name: String) {
    println!("Hello, {}! You've been greeted from Rust!", name);
}

#[tauri::command]
async fn image_to_base64(image: Vec<u8>) -> Result<String, String> {
    Ok(format!("data:image/png;base64,{}",Base64::encode_string(&image)))
}

#[tauri::command]
async fn add_member(
    content: FMembers,
    imgdata: String,
) -> Result<String, String> {
    let today = Local::now().date_naive().format("%d/%m/%Y").to_string();
    let member_id = rand::random::<u32>();

    let members = Members {
        issue_date: today,
        member_id,
        image: imgdata,
        name: content.name,
        birthday: content.birthday,
        address: content.address,
    };

    let db = DB.get().await;
    db.use_ns("ns").use_db("db").await.unwrap();

    db.create::<Option<Members>>(RecordId::from_table_key(
        "members",
        members.member_id.to_string(),
    ))
    .content(members)
    .await
    .unwrap()
    .unwrap();

    Ok("All Good!!".to_string())
}

#[tauri::command]
async fn get_members() -> Result<Vec<Members>, String> {
    let db = DB.get().await;
    db.use_ns("ns").use_db("db").await.unwrap();
    let members = db.select("members").await.unwrap();
    Ok(members)
}

#[derive(Serialize)]
pub struct Select {
    search: String,
}

#[tauri::command]
async fn search_member(search: String) -> Vec<Members> {
    let db = DB.get().await;
    db.use_ns("ns").use_db("db").await.unwrap();

    let sql = "SELECT * FROM members WHERE (name ~ $search) OR (address ~ $search) OR (region ~ $search) OR (birthday ~ $search) OR (member_id ~ $search);";

    let mut res = db.query(sql).bind(Select { search }).await.unwrap();

    res.take::<Vec<Members>>(0).unwrap()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            add_member,
            get_members,
            search_member,
            image_to_base64
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
