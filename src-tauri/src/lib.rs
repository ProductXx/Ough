// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use async_once::AsyncOnce;
use chrono::Local;
use directories::BaseDirs;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use surrealdb::{
    engine::local::{Db, RocksDb},
    RecordId, Surreal,
};
use tokio::fs;

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
    pub member_id: String,
    pub image: String,
    pub name: String,
    pub birthday: String,
    pub address: String,
    pub region: String,
    pub nationalid: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct FMembers {
    pub name: String,
    pub birthday: String,
    pub address: String,
    pub region: String,
    pub nationalid: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct Total {
    count: u32,
}

#[tauri::command]
async fn greet(name: String) {
    println!("Hello, {}! You've been greeted from Rust!", name);
}

#[tauri::command]
async fn delete_member(id: String) -> Result<String, String> {
    let db = DB.get().await;
    db.use_ns("ns").use_db("db").await.unwrap();

    db.delete::<Option<Members>>(RecordId::from_table_key("members", id)).await.unwrap();
    Ok("All Good!!".to_string())
}

#[tauri::command]
async fn add_member(
    content: FMembers,
    imgbytes: Vec<u8>,
    imgname: String,
) -> Result<String, String> {
    let db = DB.get().await;
    db.use_ns("ns").use_db("db").await.unwrap();

    let today = Local::now().date_naive().format("%d/%m/%Y").to_string();

    let mut member_id = String::new();

    let img_path = format!(
        "{}/{}_{}_{}",
        DIR.as_str(),
        member_id,
        content.name,
        imgname
    );

    let members_count = db.select::<Option<Total>>(RecordId::from_table_key("members_ids", "total_ids")).await.unwrap();

    if let Some(total) = members_count {
        member_id = format!("{:05}", total.count + 1);
        let total = Total { count: total.count + 1 };
        db.update::<Option<Total>>(RecordId::from_table_key("members_ids", "total_ids")).content(total).await.unwrap().unwrap();
    } else {
        member_id = format!("{:05}", 1);
        let total = Total { count: 1 };
        db.create::<Option<Total>>(RecordId::from_table_key("members_ids", "total_ids")).content(total).await.unwrap().unwrap();
    }

    if let Err(e) = fs::write(&img_path, imgbytes).await {
        return Err(e.to_string());
    }

    let members = Members {
        issue_date: today,
        member_id,
        image: img_path,
        name: content.name,
        birthday: content.birthday,
        address: content.address,
        region: content.region,
        nationalid: content.nationalid,
    };

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
            delete_member,
            search_member
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
