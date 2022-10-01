var properties = PropertiesService.getScriptProperties();
var PROD_TRIGGERS = (properties.getProperty("PROD_TRIGGERS")).toString().split(",");


function createTrigger(triggerName) {
	if (triggerName == null) {
		var parentFunctionName = arguments.callee.caller.name.toString();
		triggerName = parentFunctionName;
		if (triggerName !== "main") {
			var functionIndex = parentFunctionName.substring(5);
			functionIndex = functionIndex * 1 + 1;
			triggerName = parentFunctionName.substring(0, 5).concat(functionIndex);
		}
	}

	ScriptApp.newTrigger(triggerName)
				.timeBased()
				.after(1 * 60 * 1000)
				.create();
	// Run the trigger after 1 min
	Logger.log("Created Trigger = " + triggerName);
}


function deleteTrigger(triggerName) {
	if (triggerName == null) {
		triggerName = arguments.callee.caller.name.toString();
	}

	var projectTriggers = ScriptApp.getProjectTriggers();
	for (let i = 0; i < projectTriggers.length; i++) {
		if (projectTriggers[i].getHandlerFunction() == triggerName && !PROD_TRIGGERS.includes(projectTriggers[i].getUniqueId())) {
			ScriptApp.deleteTrigger(projectTriggers[i]);
			Logger.log("Deleted Trigger = " + triggerName);
		}
	}
}
