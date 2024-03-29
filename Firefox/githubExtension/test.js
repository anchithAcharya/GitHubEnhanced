console.log("testExtensionLog")

let selectPanel = null

function removeItemOnce(arr, value) {
	var index = arr.indexOf(value);
	if (index > -1) {
	  arr.splice(index, 1);
	}
	return arr;
}

function modifyElement(element) {
	element.firstChild.innerHTML =
	`
		<div class = "dropdown-arrow" data-component="trailingVisual">
			<svg aria-hidden="true" focusable="false" role="img" class="octicon octicon-triangle-down" viewBox="0 0 16 16" fill="currentColor" style="display:inline-block;user-select:none;vertical-align:text-bottom;overflow:visible">
				<path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"></path>
			</svg>
		</div>
	`
	+ element.firstChild.innerHTML
}

function convertToHierarchy(branches) {
	// Build the node structure
	const rootNode = {name:"/", children:[]}

	for (let branch of branches) {
		buildNodeRecursive(rootNode, branch.split('/'), 0);
	}

	for (let node of rootNode.children) {
		simplifyNodes(node)
	}

	return rootNode;
}

function simplifyNodes(node) {
  for (child of node.children) {
    simplifyNodes(child)
  }

  if (node.children.length === 1) {
  			node.name += ("/" + node.children[0].name)
  			node.children = node.children[0].children
	}
}

function buildNodeRecursive(node, path, idx) {
	if (idx < path.length) {
		let item = path[idx]
		let dir = node.children.find(child => child.name == item)
		if (!dir) {
			node.children.push(dir = {name: item, children:[]})
		}
		buildNodeRecursive(dir, path, idx + 1);
	}
}

function flattenNodes(node, flattenedList) {
	flattenedList.push({name: node.name, isDirectory: true})
	for (child of node.children) {
	  if (child.children.length == 0) {
		flattenedList.push({name: child.name, isDirectory: false})
	  }
	  else flattenedList = flattenNodes(child, flattenedList)
	}
  
	return flattenedList
}

const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (!mutation.addedNodes) return
  		selectPanel = document.getElementById("selectPanel")
      	if (selectPanel) {
			observer.disconnect()

			const branchBox = selectPanel.firstChild.childNodes[1].childNodes[1].firstChild

			// let newHtml = ""
			// allBranches.forEach(branch => {
			// 	newHtml += `<li>${branch}</li>`
			// });
			// branchBox.innerHTML = newHtml
		
			let absoluteIndex = Math.floor(branchBox.parentNode.scrollTop/branchBox.parentNode.scrollHeight*allBranches.length)
			branchBox.childNodes.forEach(element => {
				const elementClass = element.className.split(' ')[1]

				// if (divClassList.size < allBranches.length) {
					// if(!divClassList.has(elementClass))
					divClassList.set(elementClass, absoluteIndex)
				// }

				// else {
					// let prev=-1
					// for (let i of divClassList.values()) {
					// 	if (i != prev+1) throw new Error(`broken list: ${i} ${divClassList}`)
					// 	else prev = i
					// }
				// }

				const mappedIndex = divClassList.get(elementClass)

				// if (mappedIndex >= allBranches.length) {
				// 	element.remove()
				// 	return
				// }

				const mappedItem = flattenedHierachicalBranches.at(mappedIndex)
				// let newText = mappedIndex
				let newText = mappedItem.name
				if (mappedItem.isDirectory) newText = "> " + newText

				element.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.childNodes[1].firstChild.textContent = newText
				absoluteIndex++
			});

			startObserving()
		}
	})
})

function startObserving() {
	observer.observe(document.body, {
		childList: true,
		subtree: true,
		attributes: false,
		characterData: false
	})
}

const pathName = window.location.pathname.split('/')
const refSelector = pathName[1] + '/' + pathName[2]
const allBranches = JSON.parse(localStorage.getItem(`ref-selector:${refSelector}:branch`))['refs']
// const allBranches = [...Array(allBranches1.length).keys()].map(it=>it.toString())
const flattenedHierachicalBranches = flattenNodes(convertToHierarchy(allBranches), []).slice(1)
const divClassList = new Map()

startObserving()

// TODO:
// - Clean up code
// - Check whether "web_accessible_resources" is needed in manifest.json
// - Use branchBox.parentNode.scrollTop/branchBox.parentNode.scrollHeight to determine mappedItem
