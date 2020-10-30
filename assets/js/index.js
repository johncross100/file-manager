const arrayKey = "GLOBAL_ARRAY_KEY";
const SIZE_LIMIT = 6;

const FILE_TYPE_ARR = [
    "png", "jpg", "svg"
];

const copyArr = getLocallyStored();
let globalArray = (copyArr == null) ? [] : copyArr;

let counter = 0;

/**
 * 
 * @param {*} e 
 * 
 * On Load of Page
 */
window.onload = function(e) {

    /**
     * Get Create Folder Button
     *      On Click Create New Folder
     * 
     * Get Create File
     *      On Click Create New File
     * 
     * Get Folder List
     * 
     */

    const clickCreator = document.querySelector(".clickFolderNew");
    const createNewFile = document.querySelector("#createNewFile");
    const clickClearAll = document.querySelector(".clickClearAll");
    const clickRemoveSingle = $(".clickRemoveSingle");

    let currentIndex = "";

    const file = document.querySelector("#currentFileType");
    listAllFiles(file.value);

    file.addEventListener("change", function(e){
        listAllFiles(this.value);
    });

    clickCreator.addEventListener("click", function(e){
        const newCount = counter++;
        createObjectToArray(`New Folder`, newCount);
        getArray(".folder-list", "folder");
    });

    createNewFile.addEventListener("click", function (e) {
        
        const newCount = counter++;
        
        const newFileName = document.querySelector("#newFileName").value;
        const folderOptions = document.querySelector("#folderOptions").value;
        const newFileType = document.querySelector("#newFileType").value;

        if(newFileName == ""){
            alert("File Name is Required!!");
            return;
        }

        if(folderOptions == ""){
            alert("Folder is Required!!");
            return;
        }

        if(newFileType == ""){
            alert("File Type is Required!!");
            return;
        }

        createObjectToArray(newFileName, newCount, newFileType, folderOptions);
        getArray(".file-list", newFileType);
    });

    clickClearAll.addEventListener("click", function () {
        removeLocalStorageByKey(arrayKey);
        getArray(".folder-list", "folder");
        getArray(".file-list", "png");
        getArray(".file-list", "jpg");
        getArray(".file-list", "svg");
        globalArray = [];
        counter = 0;
        // listAllFiles(file.value);
    });

    const fileManage = $(".custom-file-manage");

    fileManage.on("click", function (e) {
        currentIndex = $(this).attr("data-identifier");
        $("#showSelectedIndex").html(currentIndex);
        $("#showSelectedIndex").show();
    });

    clickRemoveSingle.on("click", function(e){
        alert(`This is the current Index ::: ${currentIndex}`);
    });
    
};

function annotate(){
    const files = document.querySelectorAll('.custom-file-manage[data-identifier]');
    // var element = document.querySelectorAll('.custom-file-manage');
    // var dataAttribute = element.getAttribute('data-identifier');
    console.log(files);
    // [...files].forEach(btn => {
    //     let identifier = btn.getAttribute('data-identifier');
    //     // var element = document.querySelectorAll('.custom-file-manage');
    //     // console.log(identifier);
    // });
}

function listAllFiles(file) {
    getArray(".folder-list", "folder");
    getArray(".file-list", file);
}

/**
 * 
 * @param {* Name_of_the_file_or_folder_you_wish_to_create } name 
 * @param {* Current_Item_count } count 
 * @param {* File_type } fileType 
 * @param {* FOlder_Parent } folderParent 
 * 
 * Create the Object
 * 
 */
const createObjectToArray = (name, count, fileType, folderParent) => {
    
    const copyArr = getLocallyStored();
    const lastObject = getLastId(copyArr);

    const randomValue = generateRandomNumber(10000, 99999);

    if(lastObject == null || lastObject == "" || lastObject == {} || typeof lastObject == undefined){
        count = count;
    }
    else{
        let lastId = parseInt(lastObject.lastId);
        count = lastId + 1;
    }

    fileType = (fileType == null) ? "folder" : fileType;
    folderParent = (folderParent == null) ? "root" : folderParent;

    const object = {
        "name": (fileType == "folder") ? name + " " + ((count == 0) ? "" : count) : name + "",
        "lastId": count,
        "fileType": fileType,
        "folderParent": folderParent,
    };

    if(fileType == "folder"){
        const currentFolderLength = globalArray.length;
        if(currentFolderLength >= SIZE_LIMIT){
            return;
        }
    }

    globalArray.push(object);
    saveArray();

};

/**
 * Save Array to Local Storage
 */

const saveArray = () => {
    const copyArr = JSON.stringify(globalArray);
    saveToLocalStorage(arrayKey, copyArr);
};

/**
 * Retrieve Local Storage Array Value using Array Key and return the Array
 */
function getLocallyStored () {
    const oldArray = getLocalStorageValue(arrayKey);
    const copyArr = JSON.parse(oldArray);
    return copyArr;
}

/**
 * 
 * @param {*} attrValue 
 * @param {*} fileType 
 * 
 * Retrieve Array of Objects based on the fileType
 * 
 */

function getArray (attrValue, fileType) {

    const folderList = document.querySelector(`${attrValue}`);
    // console.log(attrValue, fileType);
    const typeOfFileType = typeof fileType;
    const copyArr = getLocallyStored();
    console.log(copyArr);
    folderList.innerHTML = "";
    if(copyArr == null){
        return;
    }
    copyArr.map((obj)=> {
        let creator;
        if(typeOfFileType == "string"){
            if(fileType == obj.fileType){
                creator = createDocument(obj.name, fileType);
                folderList.appendChild(creator);
            }
        }
        else{
            fileType.map((value) => {
                creator = createDocument(obj.name, value);
                folderList.appendChild(creator);
            });
        }
    });

    annotate();

}

const getLastId =  function(array, n) {
    if (array == null) 
      return void 0;
    if (n == null) 
       return array[array.length - 1];
    return array.slice(Math.max(array.length - n, 0));  
};

function updateSelect() {
    const folderOptions  = document.querySelector("#folderOptions");
    folderOptions.innerHTML = "";
    const copyArr = getLocallyStored();
    let output = "<option value='root'>Root Folder</option>";
    if(copyArr != null){
        copyArr.map((obj) => {
            output += `<option>${obj.name}</option>`;
        });
    }
    folderOptions.innerHTML = output;
}

function saveToLocalStorage (key, value) {
    window.localStorage.setItem(key, value);
}

function getLocalStorageValue(key) {
    return window.localStorage.getItem(key);
}

function removeLocalStorageByKey(key) {
    window.localStorage.removeItem(key);
}

function removeAllLocalStorageItems() {
    window.localStorage.clear();
}

function generateRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min));
}

const createDocument = (documentName, documentType) => {
    
    const parentElement = document.createElement("div");
    const randomValue = generateRandomNumber(10000, 99999);

    const parentDataDocumentRandomAttr = document.createAttribute("data-identifier");
    parentDataDocumentRandomAttr.value = `${documentName}-${randomValue}`;
    parentElement.setAttributeNode(parentDataDocumentRandomAttr);
    
    const parentClassAttr = document.createAttribute("class");
    parentClassAttr.value = "col-md-4 custom-file-manage";
    parentElement.setAttributeNode(parentClassAttr);

    const imgTag = document.createElement("img");
    const imgTagSrcAttr = document.createAttribute("src");
    const imgTagWidthAttr = document.createAttribute("width");
    imgTagSrcAttr.value = `assets/images/icons/${documentType}.png`;
    imgTagWidthAttr.value = 150;
    imgTag.setAttributeNode(imgTagSrcAttr);
    imgTag.setAttributeNode(imgTagWidthAttr);
    parentElement.appendChild(imgTag);

    const inputTextTag = document.createElement("input");
    const inputTypeAttr = document.createAttribute("type");
    const inputAttrValue = document.createAttribute("value");
    const inputAttrClass = document.createAttribute("class");
    inputTypeAttr.value = "text";
    inputAttrValue.value = `${documentName}`;
    inputAttrClass.value = "form-control custom-input";
    inputTextTag.setAttributeNode(inputTypeAttr);
    inputTextTag.setAttributeNode(inputAttrValue);
    inputTextTag.setAttributeNode(inputAttrClass);
    parentElement.appendChild(inputTextTag);
    
    return parentElement;

};