function copyFilesFromOneFolderToAnother() {
	ss = SpreadsheetApp.getActiveSpreadsheet();
	// var spreadsheetData = getSpreadsheetData();
	var parentFolder = DriveApp.getFolderById("1OtuDh6L62RkIQ14BnYG1YoPCUvWa9R0M");
	var destinationFolder = DriveApp.getFolderById("1ZRD0h_j7c1HNQyFDw6r3xC7843C2gK4x");
	var noOfFilesCopied = makeCopyFunction(parentFolder, destinationFolder);
	Logger.log("Number of files copied = " + noOfFilesCopied);
	ss.toast("Number of files copied = " + noOfFilesCopied, "Total Number", -1);
}

function getSpreadsheetData() {

	ss = SpreadsheetApp.getActiveSpreadsheet();
	sheet = SpreadsheetApp.getActiveSheet();

	var folderId = sheet.getRange(6, 2).getValue();
	Logger.log("Folder Id is: " + folderId);

	var searchString = sheet.getRange(11, 2).getValue();
	Logger.log("Search string is: " + searchString);

	var replaceString = sheet.getRange(16, 2).getValue();
	Logger.log("Replacement string is: " + replaceString);

	var multipleOccurence = sheet.getRange(6, 4).getValue();
	Logger.log("Multiple Occurrence flag is: " + multipleOccurence);

	var basicRenaming = sheet.getRange(11, 4).getValue();
	Logger.log("Basic Renaming flag is: " + basicRenaming);

	return {
		folderId : folderId,
		searchString : searchString,
		replaceString : replaceString,
		multipleOccurence : multipleOccurence,
		basicRenaming : basicRenaming
	}
}

function makeCopyFunction(parentFolder, destinationFolder) {
	var noOfFilesCopied = 0;
	var filesList = parentFolder.getFiles();
	Logger.log("Destination Folder = " + destinationFolder.getName());
	ss.toast("Destination Folder = " + destinationFolder.getName(), "Final Destination", -1);
	while (filesList.hasNext()) {
		var file = filesList.next();
		file.makeCopy(file.getName(), destinationFolder);
		Logger.log("File Copied = " + file.getName());
		noOfFilesCopied++;
	}
	return noOfFilesCopied;
}
