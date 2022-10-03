var testInput = "\n<table>\n    <colgroup>\n        <col align=\"right\" />\n        <col />\n        <col align=\"center\" />\n    </colgroup>\n    <thead>\n        <tr>\n            <td>Command         </td>\n            <td>Description     </td>\n            <th>Is implemented  </th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr>\n            <th>git status</th>\n            <td>List all new or modified    files</td>\n            <th>Yes</th>\n        </tr>\n        <tr>\n            <th>git diff</th>\n            <td>Show file differences that haven't been\n    staged</td>\n            <td>No</td>\n        </tr>\n    </tbody>\n</table>\n";
var testOutput = "| Command | Description | **Is implemented** |\n| ---: | :--- | :---: |\n| **git status** | List all new or modified files | **Yes** |\n| **git diff** | Show file differences that haven't been staged | No |";
function solution(input) {
    var div = document.createElement("div");
    div.innerHTML = input;
    var defaultAlignment = "left";
    var colProcessor = function (col) {
        return col.align.length ? col.align : defaultAlignment;
    };
    var colgroupProcessor = function (colgroup) {
        for (var i = 0; i < colgroup.children.length; i++) {
            var col = colgroup.children[i];
            alignments.push(colProcessor(col));
        }
    };
    var deleteDoubleSpace = function (string) {
        return string.replace(/\s+/gi, " ");
    };
    var deleteLineWrapping = function (string) {
        return string.replace(/\n+/gi, "");
    };
    var clearString = function (string) {
        return deleteLineWrapping(deleteDoubleSpace(string.trim()));
    };
    var cellProcessor = function (cell) {
        var _a;
        var tag = cell.tagName.toLowerCase();
        var content = clearString((_a = cell.textContent) !== null && _a !== void 0 ? _a : "");
        return {
            td: content,
            th: "**".concat(content, "**")
        }[tag];
    };
    var trProcessor = function (tr) {
        var row = new Array();
        for (var i = 0; i < tr.children.length; i++) {
            var cell = tr.children[i];
            row.push(cellProcessor(cell));
        }
        content.push(row);
    };
    var theadProcessor = function (thead) {
        for (var i = 0; i < thead.children.length; i++) {
            var tr = thead.children[i];
            trProcessor(tr);
        }
    };
    var tbodyProcessor = function (tbody) {
        for (var i = 0; i < tbody.children.length; i++) {
            var tr = tbody.children[i];
            trProcessor(tr);
        }
    };
    var processors = {
        colgroup: colgroupProcessor,
        thead: theadProcessor,
        tbody: tbodyProcessor
    };
    var alignments = new Array();
    var content = new Array();
    var table = div.firstElementChild;
    for (var i = 0; i < table.children.length; i++) {
        var element = table.children[i];
        var tag = element.tagName.toLowerCase();
        processors[tag](element);
    }
    // check if alignments are empty
    // that may be if there are no colgroup in table
    if (alignments.length !== content.length) {
        for (var i = 0; i < content.length; i++) {
            alignments.push(defaultAlignment);
        }
    }
    var mdTable = constructMarkdown(content, alignments);
    return mdTable;
}
var alignToMd = {
    left: ":---",
    right: "---:",
    center: ":---:"
};
function constructMarkdown(content, alignments) {
    var _a;
    var md = "";
    var header = content.shift();
    var EoL = "\n";
    md += "| ".concat(header === null || header === void 0 ? void 0 : header.join(" | "), " |");
    md += EoL;
    var alignRow = "| ".concat((_a = alignments === null || alignments === void 0 ? void 0 : alignments.map(function (a) { return alignToMd[a]; })) === null || _a === void 0 ? void 0 : _a.join(" | "), " |");
    md += alignRow;
    md += EoL;
    content.forEach(function (row) {
        md += "| ".concat(row === null || row === void 0 ? void 0 : row.join(" | "), " |");
        md += EoL;
    });
    return md;
}
var result = solution(testInput);
console.log("Thank you for checking console!");
console.log(result);
var inputTable = document.querySelector(".input-table");
var outputTable = document.querySelector(".output-table");
inputTable.innerHTML = "\n    <style>\n        table tr > * {\n            border: thin solid black;\n            padding: 0 1rem;\n        }\n    </style>\n".concat(testInput);
// result.split("\n").forEach((row) => {
//   const div = document.createElement("div")
//   div.textContent = row.concat("\n")
//   outputTable.append(div)
// })
outputTable.textContent = result;
