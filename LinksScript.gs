function start() {
	var spreadsheetID = SpreadsheetApp.openById("1iNznWxmRchZLPqwf3zh2P18vjvIcpqL2JAJWsB6y5OU");
	var activeSheetObject = spreadsheetID.getActiveSheet();
	
	linksDetailsList = [];
	linksDetailsList.push(["URL", "TITLE", "DESCRIPTION", "KEYWORDS"]);
	globalDCSizeInMB = 0;
	totalCount = 0;
	
	var startTime = new Date().getTime();
	process();
	var endTime = new Date().getTime();

	duration = endTime - startTime;
	globalDCSizeInGB = globalDCSizeInMB / 1024;
	
	if (totalCount > 23000 && (duration / 60000).toFixed(3) < 27) {
		writeAndFormatSheet(activeSheetObject);
	}

	sendEmailUsingGmail();
}


function process() {
	var dCFolderObject = DriveApp.getFolderById("1sHDj8jQ9SSeTDVSnOgsnhER_7Mvqk4dw");
	//dCFolderObject = DriveApp.getFolderById("1weJrLWw-rlnAc4if28itKTL-ZZOt6bdq");
	var filePath = "/ ";

	subFoldersRecursion(dCFolderObject, filePath);
}


function subFoldersRecursion(folderObject, filePath) {
	filePath = filePath + folderObject.getName() + " / ";
	addDetailsToList(folderObject, filePath);

	var subFoldersObject = folderObject.getFolders();
	while(subFoldersObject.hasNext()) {																//========Folders in Main Folder
		subFoldersRecursion(subFoldersObject.next(), filePath);					//========Recursion
	}
}


function addDetailsToList(folderObject, filePath) {
	var allFilesObject = folderObject.getFiles();

	while(allFilesObject.hasNext()) {
		var fileObject = allFilesObject.next();
		var fileName = fileObject.getName();
		var fileSize = fileObject.getSize() / (1024 * 1024);										//======== Size in MB
		//var fileURL = fileObject.getUrl();
		var fileDownloadUrl = fileObject.getDownloadUrl();
		//var base64EncodedURL = Utilities.base64EncodeWebSafe(fileDownloadUrl);
		//var base63DecodedURL = Utilities.base64DecodeWebSafe(base64EncodedURL);
		
		globalDCSizeInMB += fileSize;
		totalCount++;

		if(fileSize > 1000) {
			fileSize = (fileSize / 1024).toFixed(3) + " GB";
		} else if(fileSize < 1) {
			fileSize = (fileSize * 1024).toFixed(3) + " KB";
		} else {
			fileSize = fileSize.toFixed(3) + " MB";
		}
		linksDetailsList.push([fileDownloadUrl, fileName, fileSize, filePath]);
	}
}


function writeAndFormatSheet(activeSheetObject) {
	activeSheetObject.setFrozenRows(1);
	var writeRange = activeSheetObject.getRange(1, 1, totalCount + 1, 4);
	writeRange.setValues(linksDetailsList);
	for(i = 1; i <= activeSheetObject.getLastColumn(); i++) {
		activeSheetObject.autoResizeColumn(i);
	}
	var head = activeSheetObject.getRangeList(['1:1']);
	head.setBackground('black').setFontColor('yellow').setFontSize(20).setFontWeight('bold')
	.setFontFamily('Calibri').setFontStyle('italic').setFontLine('underline');

	//var sortRange = activeSheetObject.getRange(2, 1, activeSheetObject.getLastRow(), activeSheetObject.getLastColumn());
	//sortRange.sort(2);																			//========Sorting by Name
	//sortRange.randomize();																		//========Randomizes the Range

}


function sendEmailUsingGmail() {
	var durationMinutes = (duration / 60000).toFixed(0);
	var durationSeconds = ((duration / 1000) % 60).toFixed(0);

	var htmlTable = '<h3>Total Size = ' + globalDCSizeInGB.toFixed(3) + ' GB (' + totalCount + ')</h3>' 
				+ '<h3>Runtime = ' + durationMinutes + ' min ' + durationSeconds + ' sec</h3>';
	Logger.log(htmlTable);
	MailApp.sendEmail('f20170468h@alumni.bits-pilani.ac.in', 'DC++ Links Stats', '', {htmlBody: htmlTable})
}
