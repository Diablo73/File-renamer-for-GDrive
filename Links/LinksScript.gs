var properties = PropertiesService.getScriptProperties();
var minimumNumberOfFiles = 23000;
var maximumTimeDurationInMin = 27;
var startTimeFunction = function (){Logger.log("START PROCESS!!!"); return new Date().getTime()};
var endTimeFunction = function (){Logger.log("END PROCESS!!!"); return new Date().getTime()};
var spreadsheetID = SpreadsheetApp.openById(properties.getProperty("LINKS_SS_ID"));
var statsListRow = {"Animes": 4, "Bollywood": 5, "Cartoons": 6, "Games": 7, "Hollywood": 8, "Punjabi": 9, "TV": 10, "Unseen": 11, "Videos": 12, "一Requests": 13, "Storage Limit": 16, "Storage Used": 17};
var skipFolderForDC = ["Animes", "Bollywood", "Cartoons", "Games", "Hollywood", "Punjabi", "TV", "Unseen", "Videos", "一Requests"]

function start0() {
	linksDetailsList = [];
	linksDetailsList.push(["URL", "TITLE", "DESCRIPTION", "KEYWORDS"]);
	globalDCSizeInMB = 0;
	totalCount = 0;

	var data = linksDetailsList;
	writeAndFormatDefaultSheet(data, true);

	createTrigger();
}


function start1() {
	linksDetailsList = getLinkListData();

	var duration = process(properties.getProperty("ANIMES_FOLDER_ID"));

	if ((duration / 60000).toFixed(3) < maximumTimeDurationInMin) {
	var data = linksDetailsList;
		writeAndFormatDefaultSheet(data, false);
	}

	writeStats("Animes", duration);

	createTrigger();
	deleteTrigger();
}


function start2() {
	linksDetailsList = getLinkListData();

	var duration = process(properties.getProperty("BOLLYWOOD_FOLDER_ID"));

	if ((duration / 60000).toFixed(3) < maximumTimeDurationInMin) {
	var data = linksDetailsList;
		writeAndFormatDefaultSheet(data, false);
	}

	writeStats("Bollywood", duration);

	createTrigger();
	deleteTrigger();
}


function start3() {
	linksDetailsList = getLinkListData();

	var duration = process(properties.getProperty("CARTOONS_FOLDER_ID"));

	if ((duration / 60000).toFixed(3) < maximumTimeDurationInMin) {
	var data = linksDetailsList;
		writeAndFormatDefaultSheet(data, false);
	}

	writeStats("Cartoons", duration);

	createTrigger();
	deleteTrigger();
}


function start4() {
	linksDetailsList = getLinkListData();

	var duration = process(properties.getProperty("GAMES_FOLDER_ID"));

	if ((duration / 60000).toFixed(3) < maximumTimeDurationInMin) {
	var data = linksDetailsList;
		writeAndFormatDefaultSheet(data, false);
	}

	writeStats("Games", duration);

	createTrigger();
	deleteTrigger();
}


function start5() {
	linksDetailsList = getLinkListData();

	var duration = process(properties.getProperty("HOLLYWOOD_FOLDER_ID"));

	if ((duration / 60000).toFixed(3) < maximumTimeDurationInMin) {
	var data = linksDetailsList;
		writeAndFormatDefaultSheet(data, false);
	}

	writeStats("Hollywood", duration);

	createTrigger();
	deleteTrigger();
}


function start6() {
	linksDetailsList = getLinkListData();

	var duration = process(properties.getProperty("PUNJABI_FOLDER_ID"));

	if ((duration / 60000).toFixed(3) < maximumTimeDurationInMin) {
	var data = linksDetailsList;
		writeAndFormatDefaultSheet(data, false);
	}

	writeStats("Punjabi", duration);

	createTrigger();
	deleteTrigger();
}


function start7() {
	linksDetailsList = getLinkListData();

	var duration = process(properties.getProperty("TV_FOLDER_ID"));

	if ((duration / 60000).toFixed(3) < maximumTimeDurationInMin) {
	var data = linksDetailsList;
		writeAndFormatDefaultSheet(data, false);
	}

	writeStats("TV", duration);

	createTrigger();
	deleteTrigger();
}


function start8() {
	linksDetailsList = getLinkListData();

	var duration = process(properties.getProperty("UNSEEN_FOLDER_ID"));

	if ((duration / 60000).toFixed(3) < maximumTimeDurationInMin) {
	var data = linksDetailsList;
		writeAndFormatDefaultSheet(data, false);
	}

	writeStats("Unseen", duration);

	createTrigger();
	deleteTrigger();
}


function start9() {
	linksDetailsList = getLinkListData();

	var duration = process(properties.getProperty("VIDEOS_FOLDER_ID"));

	if ((duration / 60000).toFixed(3) < maximumTimeDurationInMin) {
	var data = linksDetailsList;
		writeAndFormatDefaultSheet(data, false);
	}

	writeStats("Videos", duration);

	createTrigger();
	deleteTrigger();
}


function start10() {
	linksDetailsList = getLinkListData();

	var duration = process(properties.getProperty("REQUESTS_FOLDER_ID"));

	if ((duration / 60000).toFixed(3) < maximumTimeDurationInMin) {
	var data = linksDetailsList;
		writeAndFormatDefaultSheet(data, false);
	}

	writeStats("一Requests", duration);

	// createTrigger();
	deleteTrigger();
}


function process(folderId) {
	var startTime = startTimeFunction();

	var folderObject = DriveApp.getFolderById(folderId);
	// folderObject = DriveApp.getFolderById("1weJrLWw-rlnAc4if28itKTL-ZZOt6bdq");
	var filePath = "/ DC++ / ";// filePathPrefix[folderObject.getName()];

	subFoldersRecursion(folderObject, filePath, folderObject.getName());
	var endTime = endTimeFunction();

	return endTime - startTime;
}


function subFoldersRecursion(folderObject, filePath, parentFolderName) {
	filePath = filePath + folderObject.getName() + " / ";
	// addDetailsToList(folderObject, filePath);

	addDetailsToList(folderObject, filePath);
	var subFoldersObject = folderObject.getFolders();
	while (subFoldersObject.hasNext()) {																//========Folders in Main Folder
		subFoldersRecursion(subFoldersObject.next(), filePath, parentFolderName);					//========Recursion
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


function writeAndFormatDefaultSheet(data, clearSheet) {
	var sheetObject = spreadsheetID.getSheetByName("LinkList");
	if (clearSheet) {
		sheetObject.clear();
	}
	writeAndFormatSheet(sheetObject, data);
}


function writeAndFormatSheet(sheetObject, data) {
	sheetObject.setFrozenRows(1);
	Logger.log("Data length = " + data.length);
	var writeRange = sheetObject.getRange(1, 1, data.length, 4);
	writeRange.setValues(data);
	for (i = 1; i <= sheetObject.getLastColumn(); i++) {
		sheetObject.autoResizeColumn(i);
	}
	var head = sheetObject.getRangeList(['1:1']);
	head.setBackground('black').setFontColor('yellow').setFontSize(20).setFontWeight('bold')
	.setFontFamily('Calibri').setFontStyle('italic').setFontLine('underline');

	// var sortRange = sheetObject.getRange(2, 1, sheetObject.getLastRow(), sheetObject.getLastColumn());
	// sortRange.sort(2);																			//========Sorting by Name
	// sortRange.randomize();																		//========Randomizes the Range
}


function writeStats(folderName, duration) {
	var durationMinutes = ((duration / 60000).toFixed(0)).padStart(2, "0");
	var durationSeconds = (((duration / 1000) % 60).toFixed(0)).padStart(2, "0");
	var columnSizeText = (globalDCSizeInMB / 1024).toFixed(3) + ' GB (' + totalCount + ')';
	var columnTimeText = durationMinutes + ' min ' + durationSeconds + ' sec';

	var statsSheetObject = spreadsheetID.getSheetByName("Stats");
	var row = statsListRow[folderName];
	var data = [folderName, columnSizeText, columnTimeText]
	var writeRange = statsSheetObject.getRange(row, 1, 1, 3);

	Logger.log(data)
	writeRange.setValues([data]);
}


function getLinkListData() {
	globalDCSizeInMB = 0;
	totalCount = 0;
	var linkListSheetObject = spreadsheetID.getSheetByName("LinkList");
	return linkListSheetObject.getDataRange().getValues();
}


function getStatsData() {
	var statsSheetObject = spreadsheetID.getSheetByName("Stats");
	var data = statsSheetObject.getRange("A:C").getValues()
	data.splice(15, data.length - 15);
}


function createBackup() {
	var desSheetObject = spreadsheetID.getSheetByName("BackupLinkList");

	var data = getLinkListData();
	Logger.log("No of Files = " + data.length);
	if (data.length > minimumNumberOfFiles) {
		writeAndFormatSheet(desSheetObject, data);
	}
}


function main() {
	try {
		start0();
		deleteTrigger();
	} catch (e) {
		Logger.log(e);
		createTrigger();
	}
}


function mainFunctionViaTrigger() {
	createTrigger("main");
}


function emailAndBackup() {
	totalCount = "∞";
	globalDCSizeInMB = DriveApp.getStorageLimit() / (1024 * 1024);
	writeStats("Storage Limit", 0);
	globalDCSizeInMB = DriveApp.getStorageUsed() / (1024 * 1024);
	writeStats("Storage Used", 0);

	var nowDate = new Date();
	if (nowDate.getHours() < 8) {
		createBackup();
	}
	sendEmailUsingGmail();
}
