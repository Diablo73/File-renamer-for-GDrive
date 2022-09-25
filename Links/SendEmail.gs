function sendEmailUsingGmail() {
	var statsSheet = spreadsheetID.getSheetByName("Stats");
	var data = statsSheet.getRange("A:C").getValues();
	var htmlTable = '';

	var tableAttributes = 'cellspacing="2" cellpadding="2" dir="ltr" border="2" style="font-family: Monospace; font-size: 16px; border-collapse: collapse; border: 5px solid #ccc; text-align: left;"'
	htmlTable += '<table ' + tableAttributes +' >';
	htmlTable += '<tr><th>' + data[0][0] + '</th>';
	htmlTable += '<th>' + data[0][1] + '</th>';
	htmlTable += '<th>' + data[0][2] + '</th></tr>';

	var tableRowsList = [];
	for (let row = 1; row < data.length; row++) {
		if (data[row][0] == "") {
			continue;
		}
		var tableRow = '<tr>';
		for (let col = 0; col < data[row].length; col++) {
			tableRow += '<td style="font-family: Monospace; font-size: 10px;">' + data[row][col] + '</td>';
		}
		tableRow += '</tr>';
		tableRowsList.push(tableRow);
	}
  
	htmlTable += tableRowsList.join("");
	htmlTable += '</table>';

	htmlTable = htmlTable.replace(/GB /g, "GB<br>");

	Logger.log(htmlTable);
	MailApp.sendEmail('f20170468h@alumni.bits-pilani.ac.in', 'DC++ Links Stats', '', {htmlBody: htmlTable})
}
