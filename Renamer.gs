function renamingByReplacingAStringWithAnother() {
	var spreadsheetData = getSpreadsheetData();
	var subFiles = getFilesIteratorFromFolderId(spreadsheetData.folderId);
	if (subFiles) {
		var numberOfFilesRenamed = renameFilesByReplacingAStringWithAnother(subFiles, spreadsheetData.searchString, spreadsheetData.replaceString);
		ss.toast("Renamer has now completed ...\nNumber of files renamed = " + numberOfFilesRenamed, "Renamer END", -1);
	}
}
	

function getSpreadsheetData() {

	ss = SpreadsheetApp.getActiveSpreadsheet();
	sheet = SpreadsheetApp.getActiveSheet();

	var folderId = sheet.getRange(6, 3).getValue();
	Logger.log("Folder Id is: " + folderId);

	var searchString = sheet.getRange(11, 3).getValue();
	Logger.log("Search string is: " + searchString);

	var replaceString = sheet.getRange(16, 3).getValue();
	Logger.log("Replace with string is: " + replaceString);

	return {
		folderId : folderId,
		searchString : searchString,
		replaceString : replaceString
	}
}


function getFilesIteratorFromFolderId(folderId) {

	stringInDriveLink = "folders/";
	
	if (folderId.includes(stringInDriveLink)) {
		folderId = folderId.substr(folderId.indexOf(stringInDriveLink) + stringInDriveLink.length);
	}

	try {
		var subFiles = DriveApp.getFolderById(folderId).getFiles();
		ss.toast("Renamer has now started ...", "Renamer START", -1);
		return subFiles;
	}catch(e) {
		Logger.log("Error getting Google Drive folder: " + e);
		var ui = SpreadsheetApp.getUi();
		var result = ui.alert(
			"Google Drive Folder ERROR",
			"Unable to get Google Drive folder. Please check folder ID",
			ui.ButtonSet.OK);
		return null;
	}
}


function renameFilesByReplacingAStringWithAnother(subFiles, searchString, replaceString) {
	numberOfFilesRenamed = 0;
	while (subFiles.hasNext()) {
		var file = subFiles.next();
		var fileName = file.getName();
		Logger.log("Sub-file name is: " + fileName);

		if (fileName.includes(searchString)) {
			var newName = fileName.replace(searchString, replaceString);
			Logger.log("New name will be: " + newName);
			file.setName(newName);
			numberOfFilesRenamed++;
		}
	}
	return numberOfFilesRenamed;
}
