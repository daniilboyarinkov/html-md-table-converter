const testInput = `
<table>
    <colgroup>
        <col align="right" />
        <col />
        <col align="center" />
    </colgroup>
    <thead>
        <tr>
            <td>Command         </td>
            <td>Description     </td>
            <th>Is implemented  </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>git status</th>
            <td>List all new or modified    files</td>
            <th>Yes</th>
        </tr>
        <tr>
            <th>git diff</th>
            <td>Show file differences that haven't been
    staged</td>
            <td>No</td>
        </tr>
    </tbody>
</table>
`

const testOutput = `| Command | Description | **Is implemented** |
| ---: | :--- | :---: |
| **git status** | List all new or modified files | **Yes** |
| **git diff** | Show file differences that haven't been staged | No |`

interface Processors {
  [any: string]: (node: Element) => void
}

function solution(input: string) {
  const div = document.createElement("div")
  div.innerHTML = input
  const defaultAlignment = "left"

  const colProcessor = (col: HTMLTableColElement) => {
    return col.align.length ? col.align : defaultAlignment
  }

  const colgroupProcessor = (colgroup: Element) => {
    for (let i = 0; i < colgroup.children.length; i++) {
      const col = colgroup.children[i]
      alignments.push(colProcessor(col as HTMLTableColElement))
    }
  }

  const deleteDoubleSpace = (string: string) => {
    return string.replace(/\s+/gi, " ")
  }

  const deleteLineWrapping = (string: string) => {
    return string.replace(/\n+/gi, "")
  }

  const clearString = (string: string) => {
    return deleteLineWrapping(deleteDoubleSpace(string.trim()))
  }

  const cellProcessor = (cell: Element) => {
    const tag: string = cell.tagName.toLowerCase()
    const content = clearString(cell.textContent ?? "")

    return {
      td: content,
      th: `**${content}**`,
    }[tag]
  }

  const trProcessor = (tr: Element) => {
    const row = new Array()
    for (let i = 0; i < tr.children.length; i++) {
      const cell = tr.children[i]
      row.push(cellProcessor(cell))
    }
    content.push(row)
  }

  const theadProcessor = (thead: Element) => {
    for (let i = 0; i < thead.children.length; i++) {
      const tr = thead.children[i]
      trProcessor(tr)
    }
  }

  const tbodyProcessor = (tbody: Element) => {
    for (let i = 0; i < tbody.children.length; i++) {
      const tr = tbody.children[i]
      trProcessor(tr)
    }
  }

  const processors: Processors = {
    colgroup: colgroupProcessor,
    thead: theadProcessor,
    tbody: tbodyProcessor,
  }

  const alignments = new Array<string>()
  const content = new Array<any>()

  const table = div.firstElementChild!

  for (let i = 0; i < table.children.length; i++) {
    const element = table.children[i]
    const tag = element.tagName.toLowerCase()
    processors[tag](element)
  }
  // check if alignments are empty
  // that may be if there are no colgroup in table
  if (alignments.length !== content.length) {
    for (let i = 0; i < content.length; i++) {
      alignments.push(defaultAlignment)
    }
  }

  const mdTable = constructMarkdown(content, alignments)

  return mdTable
}

interface AlignToMd {
  [any: string]: string
}

const alignToMd: AlignToMd = {
  left: ":---",
  right: "---:",
  center: ":---:",
}

function constructMarkdown(
  content: Array<Array<string>>,
  alignments: string[]
) {
  let md = ``
  const header = content.shift()
  const EoL = "\n"

  md += `| ${header?.join(" | ")} |`
  md += EoL

  const alignRow = `| ${alignments?.map((a) => alignToMd[a])?.join(" | ")} |`
  md += alignRow
  md += EoL

  content.forEach((row) => {
    md += `| ${row?.join(" | ")} |`
    md += EoL
  })

  return md
}

const result = solution(testInput)

console.log("Thank you for checking console!")
console.log(result)

const inputTable = document.querySelector(".input-table")!
const outputTable = document.querySelector(".output-table")!

inputTable.innerHTML = `
    <style>
        table tr > * {
            border: thin solid black;
            padding: 0 1rem;
        }
    </style>
${testInput}`

// result.split("\n").forEach((row) => {
//   const div = document.createElement("div")
//   div.textContent = row.concat("\n")
//   outputTable.append(div)
// })

outputTable.textContent = result
