try {
	var ui = SpreadsheetApp.getUi();
} catch (err) {
	Logger.log(err);
}


function getSpreadsheetData() {

	ss = SpreadsheetApp.getActiveSpreadsheet();
	sheet = SpreadsheetApp.getActiveSheet();
	var logText = "";

	var folderId = sheet.getRange(2, 2).getValue();
	logText += "Folder Id is: " + folderId;

	var renameFlag = sheet.getRange(4, 4).getValue();
	logText += "\nRename Flag is: " + renameFlag;

	var searchString = sheet.getRange(11, 2).getValue();
	logText += "\nSearch string is: " + searchString;

	var replaceString = sheet.getRange(16, 2).getValue();
	logText += "\nReplacement string is: " + replaceString;

	var multipleOccurence = sheet.getRange(11, 4).getValue();
	logText += "\nMultiple Occurrence flag is: " + multipleOccurence;

	var basicRenaming = sheet.getRange(16, 4).getValue();
	logText += "\nBasic Renaming flag is: " + basicRenaming;

	var insertString = sheet.getRange(27, 2).getValue();
	logText += "\nInsertion String is: " + insertString;

	var insertIndex = sheet.getRange(27, 4).getValue();
	logText += "\nInsertion Index is: " + insertIndex;

	var folderNameForGuid = sheet.getRange(36, 4).getValue();
	logText += "\nFolder Name for GUID is: " + folderNameForGuid;

	Logger.log(logText);

	return {
		folderId : folderId,
		renameFlag : renameFlag,
		searchString : searchString,
		replaceString : replaceString,
		multipleOccurence : multipleOccurence,
		basicRenaming : basicRenaming,
		insertString : insertString,
		insertIndex : insertIndex,
		folderNameForGuid : folderNameForGuid
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
	} catch(e) {
		Logger.log("Error getting Google Drive folder: " + e);
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
	var numberOfFilesRenamed = 0;
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


function renameFilesOfAFolderWithGuid() {
	var spreadsheetData = getSpreadsheetData();
	var folderObject = getFolderObjectFromFolderId(spreadsheetData.folderId);
  
	var numberOfFilesRenamed = 0;
	if (folderObject.getName() == spreadsheetData.folderNameForGuid) {
		var filesObject = folderObject.getFiles();

		while (filesObject.hasNext()) {
			var file = filesObject.next();
			if (!isRandomName(file.getName())) {
				var newFileName = createGUID().concat(file.getName().substring(file.getName().lastIndexOf(".")));
				Logger.log(file.getName() + "  ||  " + newFileName);
				renamer(file, newFileName, spreadsheetData.renameFlag);
				numberOfFilesRenamed++;
			}
		}
	} else {
		var result = ui.alert("Wrong Folder ERROR",
								"Folder ID and corresponding folder name mismatch. Please check again",
								ui.ButtonSet.OK);
	}
	ss.toast("Renamer has now completed ...\nNumber of files renamed = " + numberOfFilesRenamed, "Renamer END", -1);
}


function renamer(file, newFileName, renameFlag) {
	if (renameFlag) {
		file.setName(newFileName);
	}
}


function createGUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r&0x3 | 0x8);
		return v.toString(16);
	});
}


function isGUID(guid) {
	let s = guid;
	s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
	return s != null;
}


function isRandomName(name) {
	var regexPatterns = ['^[0-9]{8,10}_[0-9]{15,16}_[0-9]{18,20}_[0-9a-zA-Z]{1,4}[.][a-zA-Z]{3,4}$',
							'^img_[0-9]{1}_[0-9]{13}[.][a-zA-Z]{3,4}$']

	for (let i = 0; i < regexPatterns.length; i++) {
		let p = name;
		p = p.match(regexPatterns[i]);
		if (p != null) {
			return true;
		};
	}

	return isGUID(name.substring(0, name.lastIndexOf(".")));
}


async function sleepUsingPromise(ms) {
	return await function(ms) {return new Promise(resolve => setTimeout(resolve, ms));} (ms);
}


function sleepUsingDate(delay) {
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay);
}
