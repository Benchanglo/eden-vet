# eden-vet  [![Build Status](https://app.travis-ci.com/github/eden-vet/eden-vet)](https://travis-ci.com/eden-vet/eden-vet)


Eden-vet 網站原始碼。更新後會自動組建頁面並上傳。

上傳班表
=================
1. 準備好新的班表，並取名為"calendar.jpg"

2. 進入本頁面（ https://github.com/eden-vet/eden-vet )，按右上角的[Add file] > [Upload files]按鈕，並將班表圖檔拉到上傳區。

3. 在"Commit changes" 裡填入更新的說明（例如: 2017 4月份班表）。

4. 確認無誤後按下[Commit changes]按鈕，系統會開始組建頁面

5. 本說明頁面上方的[build]圖示顯示組建狀態， 組建時為[Build running]）完成後為[Build passing]。如顯示為紅色的[Build failing]，請洽 azai.tw@gmail.com。


新增"最新消息"
=================
1. 點選進入 /news 資料夾，按右上角[Add file] > [Create new file]

2. 路徑輸入最新消息的日期及副檔名 .md。例如 2022-01-24.md

3. 參照Markdown 語法寫入內容。參考如下：

```
 ## 2022-01-24      👈 兩個井字號及空格: 日期大標題)

 ### 文章標題         👈 3個井字號及空格: 文章標題

 內文...             👈 上下空行的文字: 內文段落

 ![](2022-01-24.jpg) 👈  插入圖檔，下面會說明如何上傳圖檔
```

4. 寫好可切換到[Preview]檢視內容, 確認無誤按下下方 [Commit new file]

5. 如需上傳圖檔，點選進入 /news 資料夾，按右上角[Add file] > [Upload files]，將圖檔拉到上傳區。建議檔名取最新消息的日期。例如 2022-01-24.jpg，或 2022-01-24a.jpg

6. 圖檔上傳完畢後，編輯最新消息時，用下列語法插入圖檔:
```
 ![](2022-01-24.jpg)  👈  括弧內為圖檔的檔名
```
