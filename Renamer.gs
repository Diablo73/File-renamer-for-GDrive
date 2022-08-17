function getSpreadsheetData() {

	ss = SpreadsheetApp.getActiveSpreadsheet();
	sheet = SpreadsheetApp.getActiveSheet();

	var folderId = sheet.getRange(2, 2).getValue();
	Logger.log("Folder Id is: " + folderId);

	var searchString = sheet.getRange(9, 2).getValue();
	Logger.log("Search string is: " + searchString);

	var replaceString = sheet.getRange(14, 2).getValue();
	Logger.log("Replacement string is: " + replaceString);

	var multipleOccurence = sheet.getRange(9, 4).getValue();
	Logger.log("Multiple Occurrence flag is: " + multipleOccurence);

	var basicRenaming = sheet.getRange(14, 4).getValue();
	Logger.log("Basic Renaming flag is: " + basicRenaming);

	var insertString = sheet.getRange(25, 2).getValue();
	Logger.log("Insertion String is: " + insertString);

	var insertIndex = sheet.getRange(25, 4).getValue();
	Logger.log("Insertion Index is: " + insertIndex);

	return {
		folderId : folderId,
		searchString : searchString,
		replaceString : replaceString,
		multipleOccurence : multipleOccurence,
		basicRenaming : basicRenaming,
		insertString : insertString,
		insertIndex : insertIndex
	}
}


function getFolderObjectFromFolderId(folderId) {

	stringInDriveLink = "folders/";
	
	if (folderId.includes(stringInDriveLink)) {
		folderId = folderId.substr(folderId.indexOf(stringInDriveLink) + stringInDriveLink.length);
	}

	try {
		var folderObject = DriveApp.getFolderById(folderId);
		ss.toast("Renamer has now started ...", "Renamer START", -1);
		return folderObject;
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


function renamingByReplacingAStringWithAnother() {
	var spreadsheetData = getSpreadsheetData();
	var folderObject = getFolderObjectFromFolderId(spreadsheetData.folderId);
	if (folderObject) {
		var numberOfFilesRenamed = renameFilesByReplacingAStringWithAnother(folderObject, spreadsheetData);
		ss.toast("Renamer has now completed ...\nNumber of files renamed = " + numberOfFilesRenamed, "Renamer END", -1);
	}
}


function renameFilesByReplacingAStringWithAnother(folderObject, spreadsheetData) {
	var searchString = spreadsheetData.searchString;
	numberOfFilesRenamed = 0;
	var searchStringList = [];
	var replaceStringList = [];
	if (spreadsheetData.basicRenaming) {
		searchStringList  = ["+", "%20", "%2C", "%27", "%28", "%29", "%5B", "%5D"]
		replaceStringList = [" ", " "  , ","  , "'"  , "("  , ")"  , "["  , "]"  ]
	}
	if (spreadsheetData.searchString != "") {
		searchStringList.push(spreadsheetData.searchString);
		replaceStringList.push(spreadsheetData.replaceString);
	}
    Logger.log("Search String list is: " + searchStringList);
	Logger.log("Replace String list is: " + replaceStringList);
	var subFiles = folderObject.getFiles();
	
	while (subFiles.hasNext()) {
		var file = subFiles.next();
		var fileName = file.getName();
		Logger.log("Sub-file name is: " + fileName);
		var newName = fileName;
		var renameRequired = false;

		for (var i = 0; i < searchStringList.length; i++) {
			if (newName.includes(searchStringList[i])) {
				Logger.log("Search String is: " + searchStringList[i]);
				Logger.log("Replace String is: " + replaceStringList[i]);
				renameRequired = true;
				if (spreadsheetData.multipleOccurence) {
					while (newName.includes(searchStringList[i])) {
						newName = newName.replace(searchStringList[i], replaceStringList[i]);
					}
				} else {
					newName = newName.replace(searchStringList[i], replaceStringList[i]);
				}
			}
		}
		Logger.log("New name will be: " + newName);
		if (renameRequired) {
			numberOfFilesRenamed++;
			file.setName(newName);
		}
	}
	return numberOfFilesRenamed;
}


function renamingByInsertingAStringAfterIndex() {
	var spreadsheetData = getSpreadsheetData();
	var folderObject = getFolderObjectFromFolderId(spreadsheetData.folderId);
	if (folderObject) {
		var numberOfFilesRenamed = renameFilesByInsertingAStringAfterIndex(folderObject, spreadsheetData);
		ss.toast("Renamer has now completed ...\nNumber of files renamed = " + numberOfFilesRenamed, "Renamer END", -1);
	}
}


function renameFilesByInsertingAStringAfterIndex(folderObject, spreadsheetData) {
	var insertString = spreadsheetData.insertString;
	var insertIndex = spreadsheetData.insertIndex;
	if (spreadsheetData.insertString == "") {
		return 0;
	}
	numberOfFilesRenamed = 0;
	var subFiles = folderObject.getFiles();
	
	while (subFiles.hasNext()) {
		var file = subFiles.next();
		var fileName = file.getName();
		Logger.log("Sub-file name is: " + fileName);
		var newName = fileName.slice(0, insertIndex) + insertString + fileName.slice(insertIndex);

		Logger.log("New name will be: " + newName);
		numberOfFilesRenamed++;
		file.setName(newName);
	}
	return numberOfFilesRenamed;
}
