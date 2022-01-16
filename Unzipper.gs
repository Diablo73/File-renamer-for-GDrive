function unZipper() {
	ss = SpreadsheetApp.getActiveSpreadsheet();
	var parentFolder = DriveApp.getFolderById("1Xbl-kWbm5FHp4JEa86fBO2SK3eKUgfVz");
	var zipFilesList = parentFolder.getFiles();
	while (zipFilesList.hasNext()) {
		var zipFileObject = zipFilesList.next();
		var zipFileName = zipFileObject.getName();
		zipFileName = zipFileObject.getName().slice(0, zipFileName.lastIndexOf("."));
		Logger.log("Zip file name = " + zipFileName);
		ss.toast("Zip file name = " + zipFileName, "Zip File Name", -1);
		var newFolderName = zipFileName;
		var newFolderList = parentFolder.getFolders();

		var unzippedFolder = createFolderForExtraction(parentFolder, newFolderList, newFolderName);

		var noOfFilesExtracted = extractFilesFromZip(zipFileName, zipFileObject, unzippedFolder);

		Logger.log("Total files extracted = " + noOfFilesExtracted);
		ss.toast("Total files extracted = " + noOfFilesExtracted, "Total Files Extracted", -1);
	}
}


function createFolderForExtraction(parentFolder, newFolderList, newFolderName) {
	var folderListNames = [];
	while (newFolderList.hasNext()) {
		var newFolderObject = newFolderList.next()
		folderListNames.push(newFolderObject.getName());
	}
	var i = 0;
	Logger.log("List of folders = " + folderListNames);
	while (folderListNames.includes(newFolderName)) {
		var suffix = " [" + i + "]";
		if (newFolderName.endsWith(suffix)) {
			newFolderName = newFolderName.slice(0, -suffix.length)
		}
		i++;
		newFolderName = newFolderName + " [" + i + "]";
	}
	Logger.log("New folder name = " + newFolderName);
	ss.toast("New folder name = " + newFolderName, "New Folder Name", -1);
	parentFolder.createFolder(newFolderName);
	return parentFolder.getFoldersByName(newFolderName).next();
}


function extractFilesFromZip(zipFileName, zipFileObject, unzippedFolder) {
	var noOfFilesExtracted = 0;
	var zipFileBlob = zipFileObject.getBlob();
	zipFileBlob.setContentType("application/zip");
	var unZippedfileList = Utilities.unzip(zipFileBlob);
	Logger.log("Total files in zip = " + (unZippedfileList.length - 1));
	ss.toast("Total files in zip = " + (unZippedfileList.length - 1), "Total Files in ZIP", -1);
	for (var i = 0; i < unZippedfileList.length; i++) {
		if (unZippedfileList[i].getName().length > (zipFileName.length + 1)) {
			var newDriveFile = unzippedFolder.createFile(unZippedfileList[i]);
			var newFileName = unZippedfileList[i].getName().substr((zipFileName.length + 1));
			newDriveFile.setName(newFileName);
			Logger.log("New file name = " + newFileName);
			noOfFilesExtracted++;
		}
	}
	return noOfFilesExtracted;
}
