var userProperties = PropertiesService.getUserProperties();
var scriptProperties = PropertiesService.getScriptProperties();
var folderNames = ["Animes", "Bollywood", "Cartoons", "Games", "Hollywood", "Punjabi", "TV", "Unseen_Movies", "Unseen_TV", "Videos", "Requests"];


function mainFunctionViaTrigger_v2() {
	var targetDate = new Date;
	targetDate.setHours(targetDate.getHours() - 7);
	var logs = "";
	for (let i in folderNames) {
		const request = {
							"ancestor_name": "items/" + scriptProperties.getProperty(folderNames[i].toUpperCase() + "_FOLDER_ID"),
							"filter": "time >= \"" + targetDate.toISOString() + "\""
							// "pageSize": 1
						};
		const response = DriveActivity.Activity.query(request);
		const activities = response.activities;
		if (!activities || activities.length == 0) {
			logs += "\nNo activity for folder: " + folderNames[i];
			continue;
		}

		var trigger = createTrigger("main_v2");
		userProperties.setProperty(trigger.getUniqueId().toString(), folderNames[i]);
		logs += "\nAdded user property: " + trigger.getUniqueId() + " - " + folderNames[i];
	}
  Logger.log(logs);
}


function main_v2(trigger) {
	var triggerUid = trigger["triggerUid"].toString();
	linksDetailsList = getLinkListData();

	var processResult = process(scriptProperties.getProperty(userProperties.getProperty(triggerUid).toUpperCase() + "_FOLDER_ID"));

	if ((processResult.duration / 60000).toFixed(3) < maximumTimeDurationInMin) {
		var data = Array.from(new Set(linksDetailsList));
		writeAndFormatDefaultSheet(data, false);
	}

	writeStats(processResult.parentFolderName, processResult.duration);

	userProperties.deleteProperty(triggerUid);
	deleteTrigger(triggerUid);
}


function getActivity() {
	var targetDate = new Date;
	targetDate.setHours(targetDate.getHours() - 7);
	var folderName = "Unseen_TV";
	var logs = "";
	const request = {
						"ancestor_name": "items/" + scriptProperties.getProperty(folderName.toUpperCase() + "_FOLDER_ID"),
						"filter": "time >= \"" + targetDate.toISOString() + "\""
						// "pageSize": 1
					};
	const response = DriveActivity.Activity.query(request);
	const activities = response.activities;
	if (!activities || activities.length == 0) {
		logs += "\nNo activity for folder: " + folderNames[i];
	}

	logs += "\n" + activities;
	Logger.log(logs);
}
