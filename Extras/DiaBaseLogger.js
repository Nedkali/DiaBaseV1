// DIABASE 1.02
//////////////////////////////////////
/**
*	@filename	MuleLogger.js
*	@author		kolton
*	@desc		Modified by Ned for Diabase compatability
*/

var MuleLogger = {
	LogAccounts: {
		/* Format: 
			"account1/password1/realm": ["charname1", "charname2 etc"],
			"account2/password2/realm": ["charnameX", "charnameY etc"],
			"account3/password3/realm": ["all"]

			To log a full account, put "accountname/password/realm": ["all"]

			realm = useast, uswest, europe or asia

			Individual entries are separated with a comma.
		*/

		"account/password/realm": ["all"]

	},

	LogGame: ["", ""], // ["gamename", "password"]

	IngameTime: 185, // Time to stay in game



	inGameCheck: function () {
		
		
		if (getScript("D2BotMuleLog.dbj") && this.LogGame[0] && me.gamename.match(this.LogGame[0], "i")) {
			print("ÿc4MuleLoggerÿc0: Logging items on " + me.name + ".");
			D2Bot.printToConsole("MuleLogger: Logging items on " + me.name + ".", 7);
			this.logChar();

			while ((getTickCount() - me.gamestarttime) < this.IngameTime * 1000) {
				delay(1000);
			}

			quit();

			return true;
		}

		return false;
	},

	logChar: function () {
		while (!me.gameReady) {
			delay(100);
		}

		var i, folder, string, parsedItem,
			items = me.getItems(),
			realm = me.realm || "Single Player",
			account = me.account || "Unknown",
			finalString = "", temp = "";
			
		if (!items || !items.length) {
			return;
		}	

		if (!FileTools.exists("mules/MuleInventory")) {
			folder = dopen("mules");

			folder.create("MuleInventory");
		}

		var mytime = new Date().toLocaleFormat("%H:%M:%S");
		var mydate = new Date();

		
		finalString += "Unknown\n";
		finalString += me.account || "Unknown";
		finalString += "\n" + me.name + "\n";		
		finalString += "Unknown\n";
		finalString += realm + "\n";
		if(me.playertype){finalString += "True\n"}
			else{finalString += "False\n"}
			
		if(me.ladder){finalString += "True\n"}
			else{finalString += "False\n"}
			
		if(me.gametype){finalString += "True\n"}
			else{finalString += "False\n"}
			
		finalString += mytime + "\n";
		finalString += mydate.getDate() + "/" + (mydate.getMonth()+1) + "/" + mydate.getFullYear();
		finalString += "\n\n";
		

		
		for (i = 0; i < items.length; i += 1) {
			if(items[i].mode === 1){continue;}
			
			if(this.SkipItem(items[i].classid)){continue;}

			string = items[i].name.trim() + "\n"
			string += items[i].ilvl + "\n"
			if(items[i].itemType >= 91 && items[i].itemType <= 102)
				string += "Item Base Gem\n";
			else
				string += "Item Base " + items[i].itemType + "\n"
			
			string += "Item Quality " + this.GetQuality(items[i].quality) + "\n";
			string += "Item Image " + items[i].classid + "\n";

			if((items[i].getFlag&0x4000000) > 0)
				string += "True\n";
			else
				string += "False\n";
			
			string += this.ItemDecipher(items[i]);
			
			
			finalString += (string + "\n");
		}



		FileTools.writeText("MuleInventory/" + account + "_" + me.name + ".txt", finalString);
		print("Item logging done.");
	},
	
	GetQuality: function (id){
	
		switch(id)	{
			case 1: return "LowQuality";
			case 2:	return "Normal";
			case 3: return "Superior";
			case 4: return "Magic";
			case 5: return "Set";
			case 6: return "Rare";
			case 7: return "Unique";
			case 8: return "Crafted";
		}

		return "Unknown";
	},
	
	SkipItem: function (id){
		
		switch(id)	{
			case 515: // rejuv
			case 516: // full rejuv
			case 518: // tome
			case 519: // tome
			case 543: //key
			case 549: // horadric cube
			case 587: // Potions
			case 588:
			case 589:
			case 590:
			case 591:
			case 592:
			case 594:
			case 595:
			case 596:
				return true;
		}		
		return false;
	},
	
	ItemDecipher: function (item){
		const REGEX6 = new RegExp("ÿc[0-9]", "gi");

		var i, string = item.description;
		string = string.replace(REGEX6, ""); 

		var temp = string.split("\n");
		temp.reverse();
		string = "";
		for (i = 0; i < temp.length; i += 1) {
			if(temp[i].contains(item.name)){continue;}
			if(temp[i].length == 0){continue;}
			string += temp[i] + "\n";
		}
		
		return string;

	}
};