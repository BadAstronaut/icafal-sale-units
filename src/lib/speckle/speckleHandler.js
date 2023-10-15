import { ViewerEvent } from "@speckle/viewer";
import * as THREE from 'three';
import { getStreamCommits, getUserData, getStreamObjects } from "./speckleUtils.js";
import { get } from "svelte/store";
import { speckleViewer, finishLoading, speckleStream, speckleDatatree, speckleDeptos, speckleSchedule } from "../../stores/toolStore";
import { buildViewerData } from '$lib/speckle/viewerBuilder';
import ObjectLoader from '@speckle/objectloader';
import { json } from "@sveltejs/kit";
const token = import.meta.env.VITE_SPECKLE_TOCKEN;

export async function fetchUserData() {
  let userData = null;
  //console.log("us");
  let us = await getUserData(token).then((user) => {
    let userName = user.data.user.name;
    let serverInfo = user.data.serverInfo.name;
    userData = [userName, serverInfo];
    //console.log(userData)
    return userData;
  });
}
export function selectElementsById(id) {
  const v = get(speckleViewer).speckleViewer;
  const speckDT = v.getDataTree();
  //this bit was key in making it work. the data tree 
  const objPredicate = (uui, obj) => {
    return obj.id === id;
  }
  const speckleObjectList = speckDT.findFirst(objPredicate);

  return speckleObjectList;
}

export async function lookTopView() {
  const v = get(speckleViewer).speckleViewer;
  if (v) {
    v.setView('top', true);
    v.zoom([], 0.75);
    //console.log(activeV, "cosonle log ");
    //console.log("showing sensor animation",get(activeIoTIndicators));
  }
}
// function calll to filter by properties 
// function calll to filter by properties  filtra el lote con numero igual a 12
export async function filterByPromptConditions(categoryName, propertyName, propertyValue, condition) {
  const v = get(speckleViewer).speckleViewer;
  const speckledataTree = get(speckleDatatree);
  let elementIds = [];
  console.log(categoryName, propertyName, propertyValue, condition, "input properties.........");
  if (categoryName === "Emplazamiento") {
    elementIds = promptParameterExtractorEmplazamiento(propertyName, propertyValue, condition);
  }
  //const elementIds = promptParameterExtractor(selectedCategoryElements, propertyName, propertyValue, condition);
  return elementIds;
  //console.log(selectedCategoryElements, "selectedCategoryElements");

};
export function lightSpeckleGenerator(speckleObjectDataTree) {
  let lightSpeckleObject = {
    id: speckleObject.id,
    type: speckleObject.type,
    category: speckleObject.category,
    area: speckleObject.area,
    estado: speckleObject.estado,
    servicios: speckleObject.servicios,
    sector: speckleObject.sector,
    loteid: speckleObject.loteid,
  };
  let lightspeckleArray = [];
}
//get a list of present categories in data tree 
//const checkCategories = speckledataTree.child
//console.log (speckledataTree, "speckle data tree.........");
//console.log (categoryName, propertyName, propertyValue, condition, "filter by conditions");




// function calll to filter by properties 
// function calll to filter by properties 
export async function lookView(view) {
  const v = get(speckleViewer).speckleViewer;
  if (v) {
    switch (view) {
      case 'front':
        v.setView('front', true);
        break;
      case 'back':
        v.setView('back', true);
        break;
      case 'up':
        v.setView('up', true);
        break;
      case 'top':
        v.setView('top', true);
        break;
      case 'down':
        v.setView('down', true);
        break;
      case 'bottom':
        v.setView('bottom', true);
        break;
      case 'right':
        v.setView('right', true);
        break;
      case 'left':
        v.setView('left', true);
        break;
      case '3d':
        v.setView('3d', true);
        break;
      default:
        break;
    }

    v.zoom([], 0.75);
    //console.log(activeV, "cosonle log ");
    //console.log("showing sensor animation",get(activeIoTIndicators));
  }
}


export async function colorById(objectIds, color) {
  const v = get(speckleViewer).speckleViewer;
  await resetViewerFilters();
  const QueryObjects = {
    objectIds: objectIds,
    color: color
  };

  v.setUserObjectColors([QueryObjects])
}
//select elements by property value
export function selectElementsByPropNameValue(propNAme, propValue) {
  const v = get(speckleViewer).speckleViewer;
  const speckledataTree = get(speckleDatatree);
  const sStream = get(speckleStream);
  const color = 0x66c0b7;

  //refactor later to call this on viewer load and store it in a store
  // const dataTree=v.getDataTree();
  // const objects = dataTree.findAll((guid, obj) => {
  //   return obj.type === 'Wallmix. e=15 cm'
  // })
  if (speckledataTree !== null && v.speckleViewer !== null) {
    const objects = speckledataTree.findAll((guid, obj) => {
      return obj.type === 'Wallmix. e=15 cm'
    })
    //build the stream url for the firt object of the data tree 
    console.log(speckledataTree, "objects", objects, v);
    const obj = objUrl(sStream, objects[0].id);


    //get the ids of the object array 
    const ids = objects.map((obj) => {
      return obj.id;
    });

    changeElementColorByIds(ids, color);
    return objects;


  }

}
export function generateRandomColor() {
  const getRandomByte = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const _color = `0x${getRandomByte()}${getRandomByte()}${getRandomByte()}`;
  console.log("coliring",_color);
  let hexNumber = parseInt(_color, 16);
  let color = new THREE.Color(hexNumber);
  return color;
}

export async function resetViewerFilters() {
  const v = get(speckleViewer).speckleViewer;
  if (v !== null) {
    await v.resetFilters();
    v.requestRender();
  }
}

export async function reloadViewerGetObjectsByIds(
  viewerI,
  speckleStream,
  ids,
  scheduleStram,
) {
  const stm = fetchStreamData;
  const v = viewerI;
  console.log("currentT", token);
  const branch = await fetchStreamData(speckleStream);
  const scheduleBranch = await fetchStreamData(scheduleStram);
  console.log("branch in reloadv----", speckleStream, scheduleStram, scheduleBranch);
  await v.unloadAll();
  if (branch) {
    const obj = objUrl(speckleStream, branch.commits.items[0].referencedObject);
    //console.log("obj", obj);
    // get schedule 
    //const schedule = objUrl(scheduleStram, scheduleBranch.commits.items[0].referencedObject);
    //console.log("obj Schedule", schedule);

    await v.loadObject(obj, token);

    v.zoom(0.7);

    await v.init();
    let p = Promise.resolve(v);
    p.then(() => {
      speckleViewer.set({ 'speckleViewer': v })
      speckleDatatree.set(v.getDataTree());
      buildViewerData();
      finishLoading.set(true);
    })
    const speckObjects = v.getDataTree();
    const objects = "ok"
    return speckObjects;
  } else {
    return null;
  }


}

export async function processSpeckleSchedule(objectId = "b6bc2de8c6e1a8412587e561f8d07d8b") {
  const streamSchedule = await getStreamObjects(get(speckleSchedule), token, objectId);
  return streamSchedule;

}
export async function reloadViewer(speckleStream) {
  const v = get(speckleViewer).speckleViewer;
  const branch = await fetchStreamData(speckleStream);
  if (v && branch) {
    //@ts-ignore
    await v.unloadAll();
    const obj = objUrl(speckleStream, branch.commits.items[0].referencedObject);
    await v.loadObject(obj, token);
    v.zoom(1);
  }

}

//pass a Type property name and a list of values. return all properties of matching values
export async function getPropertiesByTypeParameter(pName, pValueList) {
  const v = get(speckleViewer).speckleViewer;
  //console.log(v);
  // @ts-ignore
  const speckObjects = v.getDataTree();
  let objtList = [];
  pValueList.forEach((pVal) => {
    const objects = speckObjects.findAll((uui, obj) => {
      if ("parameters" in obj) {
        //this bit checks if parameter exist and filter revit instances
        if (
          pName in obj.parameters &&
          obj.speckle_type != "Objects.BuiltElements.Revit.RevitElementType"
        ) {
          //console.log("family", obj.speckle_type);
          return obj.parameters[pName].value === pVal;
        }
      }
    });
    objtList.push(objects);
  });

  //console.log("treeObjets to walk", speckObjects);
  return objtList;
}
//give list of 
export function filterByCategoryNames(DT, categoryNames) {
  //console.log("------grinding objedctsss-",DT, );
  const objects = DT.findAll((uui, obj) => {
    //console.log(obj);
    if (obj.category && obj.speckle_type == "Objects.Other.Revit.RevitInstance") {
      const catName = obj.category;
      //console.log("-------",obj, );
      return categoryNames.includes(catName);
    }

  });
  return objects;
}


//X ray functionality it will take a list of categories,
//and list of current selected elements
export function xrayByCategory(catList) {
  const v = get(speckleViewer).speckleViewer;
  let sElements = [];
  // @ts-ignore
  const speckObjects = v.getDataTree();

  catList.forEach((catName) => {
    const objects = speckObjects.findAll((uui, obj) => {
      //console.log(obj)
      let speckT = obj.speckle_type.split(".").pop();
      //console.log(speckT)
      return speckT === catName;

      console.log(objects);
    });
    if (objects.length > 0) {
      objects.forEach((el) => {
        sElements.push(el.id);
      });
    }
    console.log(sElements);
    // @ts-ignore
    v.isolateObjects(sElements);
  });
}

//this will get you all the elements of a type if you pass a revit category and type name

export function getElementsByFamType(familyName, typeName) {
  const v = get(speckleViewer).speckleViewer;
  // @ts-ignore
  const speckObjects = v.getDataTree();
  const objects = speckObjects.findAll((uui, obj) => {
    //console.log(obj)
    return obj.family === familyName;
  });
  //console.log(objects);
  //filter by fixed property value
  let filterSpeckObj = objects.filter((sO) => {
    //console.log(sO);
    if (sO.type == typeName) {
      return sO;
    }
  });
  return filterSpeckObj;
  //console.log(filterSpeckObj);
}
//this will filter the elements and return the one that has property value
export function filterElementsByParameterContainsName(
  speckElement,
  pName,
  pValue
) {
  //check if the property exists
  let speckElementsOut = [];
  let elementsWithParameters = [speckElement.parameters].forEach(
    (parameter) => {
      let p;
      //console.log(parameter['8c57ae69-89f5-4891-a83b-5efcd57bddde'])
      try {
        p = Object.keys(parameter).filter((kp) => {
          if (kp.includes(pName) && parameter[pName].value.includes(pValue)) {
            //console.log(speckElement);
            speckElementsOut.push(speckElement);
          }
        });
      } catch (error) {
        //console.log(error);
      }
    }
  );

  if (speckElementsOut.length != 0) {
    return speckElementsOut;
  }
}
//color elements by list id and color code
export function changeElementColorByIds(listOfIds, color = 0xff0000, hide = false) {
  const v = get(speckleViewer).speckleViewer;
  //reset isolated elements

  //construct object
  let queryObject = [{
    objectIds: listOfIds,
    color: color
  }]
  // @ts-ignore
  v.setUserObjectColors(queryObject);
  if (hide) {
    // @ts-ignore
    v.isolateObjects(listOfIds);
  }
}

export function handleBeaconOrigin(speckleObj) {
  let byBasePoint = speckleObj.basePoint != undefined ? true : false;
  let byLine = speckleObj.baseLine != undefined ? true : false;
  if (byBasePoint) {
    let point = speckleObj.basePoint;
    let xCoor = point.x / unitHandler(point);
    let yCoor = point.y / unitHandler(point);
    let zCoor = point.z / unitHandler(point);
    return [xCoor, yCoor, zCoor];
  }
  if (byLine) {
    //code by line case.
  }
}

function unitHandler(speckleObj) {
  const units = { mm: 1000, cm: 100, m: 1 };
  const divider = units[speckleObj.units];
  return divider;
}

//Helpers-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/
async function fetchStreamData(speckleStream) {
  let streamData = null;
  let branch = null;
  const b = await getStreamCommits(speckleStream, 1, null, token).then(
    (str) => {
      streamData = str.data.stream;
      //console.log(streamData, "stream bug ...................");
      // Split the branches into "main" and everything else
      //console.log(streamData, "stream bug ...................");
      if (streamData) {

        let mainBranch = streamData.branches.items.find((b) => b.name == "main");
        branch = mainBranch;
        console.log('Branch:', branch)
      }
      else {
        //fix later not sure why this happens
        console.log('No stream data fix later...', speckleStream)
      }
    }
  );

  return branch;
}
//fetch data from a particular commit
async function fetchStreamDataFromCommit(speckleStream, commitId) {
  let streamData = null;
  let branch = null;
  const b = await getStreamCommits(speckleStream, 1, null, token).then(
    (str) => {
      streamData = str.data.stream;
      //console.log(stream)
      // Split the branches into "main" and everything else
      //console.log(streamData.branches.items)
      let mainBranch = streamData.branches.items.find((b) => b.name == "main");
      branch = mainBranch.commits.items.filter((c) => {
        //console.log("looking commit",c.referencedObject)
        return c.referencedObject == commitId;
      });
      //console.log('Branch:',branch)
    }
  );

  return branch;
}

function objUrl(streamId, objId) {
  return `https://speckle.xyz/streams/${streamId}/objects/${objId}`;
}

async function reload(streamId) {
  //document.getElementById("reloadButton").classList.add("is-loading")

  await this.fetchStreamData(); // Fetch the stream data
  await this.reloadViewer(); // Reload the viewer once the stream data has been fetched

  //document.getElementById("reloadButton").classList.remove("is-loading")
}
