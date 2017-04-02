$(document).ready(function(){
  var go =""
  var keyMap = new Map();
  var tab = 0
  $("#convertData").click(function(){
      convertToStruct();
  });



function convertToStruct(){
  var data ='{"Header": "headerdata", "body":{"body1": "body1data", "body2": {"la": {"fa":"tuku"}}}, "tail":{"tick": "tock"}}'
  var jsonObject;
  try {
      jsonObject = JSON.parse(data);
  } catch (e) {
      console.log("invalid json format");
      return;
  }
  appendString("type AutoGenerated struct {\n")
  ++tab;
    var keys = []
    for(var k in jsonObject){
      propertyName =firstLetterUppercase(k)
      //datatype = goType(jsonObject[k])
      if(goType(jsonObject[k]) == "struct"){
        appendNested(k, jsonObject[k])
      }
      indent(tab);
      appendString(firstLetterUppercase(k)+" "+goType(jsonObject[k])+' `json:"'+k+'"`\n')
      console.log("values of json", jsonObject[k]);
      keys.push(k)
    }
    console.log("key datas", keys);
    indent(0)
    appendString("}\n")
    var mapIter = keyMap.values();
    for (var i=0 ; i<keyMap.size; i++){
      appendString(mapIter.next().value)
    }
}


function goType(val){
  switch (typeof val)
		{
			case "string":
					return "string";
			case "number":
				if (val % 1 === 0)
				{
						return "int";
				}
				else
					return "float64";
			case "boolean":
				return "bool";
			case "object":
        console.log("inside object");
				if (Array.isArray(val))
					return "slice";
				return "struct";
			default:
				return "notFound";
		}

}


function appendString(str){
  go += str;
  console.log("current progress", go);
}

function firstLetterUppercase(str){
  console.log("uppercased data ::",str.charAt(0).toUpperCase() + str.slice(1));
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function indent(tabs){
		for (var i = 0; i < tabs; i++)
			go += '\t';
	}

  function appendNested(keyName, objectData){
  //

    var str = JSON.stringify(objectData);
    console.log("inside appendNested",str);
    var nestedGo ="";

    var jsonObject;
    jsonObject = JSON.parse(str);
    nestedGo += "type "+firstLetterUppercase(keyName)+" struct {\n"
  //  ++tab;
    var keys = []
    for(var k in jsonObject){
      propertyName =firstLetterUppercase(k)
      datatype = goType(jsonObject[k])
      //indent(tab)
      nestedGo += propertyName+" "+datatype+' `json:"'+k+'"`\n'
      if( goType(jsonObject[k]) === "struct"){
        appendNested(firstLetterUppercase(k), jsonObject[k] )
      }
    }
  //indent(0)
    nestedGo +="}\n"
    keyMap.set(keyName, nestedGo)
    var mapIter = keyMap.values();
    console.log("data man", mapIter.next().value); // "foo"

  }


});
