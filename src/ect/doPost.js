function doPost(e) {
  try {
    Logger.log('doPost executed!');

    // 요청 데이터 파싱
    let data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
      Logger.log('Received data: ' + JSON.stringify(data));
    }

    // Google Sheets에 저장 (스프레드시트 ID를 실제 ID로 변경하세요)
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();

    // 헤더가 없으면 추가
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Email',
        'Order Number',
        'Return Address',
        'Return Quantity',
        'Mobile Phone',
        'Return Reason',
        'Other Reason',
        'Return Condition',
      ]);
    }

    // Return Condition을 배열에서 문자열로 변환
    let returnCondition = '';
    if (data.returnCondition) {
      if (Array.isArray(data.returnCondition)) {
        returnCondition = data.returnCondition.join(', ');
      } else {
        returnCondition = data.returnCondition;
      }
    }

    // 데이터 추가
    const timestamp = new Date();
    sheet.appendRow([
      timestamp,
      data.email || '',
      data.orderNumber || '',
      data.returnAddress || '',
      data.returnQuantity || '',
      data.mobilePhone || '',
      data.returnReason || '',
      data.otherReasonText || '',
      returnCondition,
    ]);

    Logger.log('Data saved successfully');

    // 성공 응답 반환
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: 'Data saved successfully',
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);

    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // GET 요청 테스트용
  Logger.log('doGet executed!');
  return ContentService.createTextOutput(
    JSON.stringify({ success: true, message: 'GET works' })
  ).setMimeType(ContentService.MimeType.JSON);
}
