// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::Path;

use directories::BaseDirs;
use lazy_static::lazy_static;
use tokio::fs;

lazy_static! {
    pub static ref DIR: String = format!(
        "{}/Ough",
        BaseDirs::new().unwrap().cache_dir().display().to_string()
    );
}

#[tokio::main]
async fn main() {
    let path = Path::new(DIR.as_str());
    if !path.exists() {
        fs::create_dir_all(path).await.unwrap();
    }
    idk_lib::run()
}
