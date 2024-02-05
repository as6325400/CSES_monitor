# CSES Monitor

## 用途

此監視器可以指定想監視的 User ，只要該幾位 User 一有新的題目 Accept ，便會傳訊息到指定頻道

## 部署方法

1. 將 exampleenv 改成 .env
2. 填入你要用來監視的 帳號 密碼(因為有些資訊要登陸才能看到, 這邊建議新創一個專門監視的帳號)
3. 獲取 CSES Token
   ![截圖 2024-02-05 下午2 10 46](https://github.com/as6325400/CSES_monitor/assets/105158172/74cc8e1d-1f83-4790-9f4e-411e888c5443)
   登陸後到 CSES 介面 按下 F12 選擇應用程式，在找到 cookie，記得填入的時候要多加上一個 PHPSESSID
4. 填入 Dc BOT 的 Token 以及想要發的頻道 Dc BOT 的部分請自行 Google
5. 最後大概會長這樣
   ![截圖 2024-02-05 下午2 14 41](https://github.com/as6325400/CSES_monitor/assets/105158172/2cd17ffd-633c-409b-bcfa-d0e86aa74155)
6. 建立 Docker image 並且啟動(安裝 Docker 方法請自行 Google)

   首先在專案根目錄 terminal
   ```
   sudo docker build -t "cses_monitor" .
   ```

   建立容器
   ```
   sudo docker run --name "monitor1" "cses_monitor"
   ```
7. 完成，指定的人 AC 後會傳訊息到指定頻道

## 指令

下文中出現的 ID 皆為 CSES USER ID，ID 位於網址處
![截圖 2024-02-05 下午2 21 42](https://github.com/as6325400/CSES_monitor/assets/105158172/08bbbcd2-3ab5-4fff-8322-c1d3f4efb592)


1. 新增使用者
   ```
   & add [ID]
   ```
2. 查詢使用者

   查詢全部
   ```
   & show all
   ```

   查詢單一使用者
   ```
   & show [UserName]
   ```
   
