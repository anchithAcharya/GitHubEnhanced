console.log("testExtensionLog")
document.body.style.border = '1px solid red';

let selectPanel = null

const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (!mutation.addedNodes) return
  		selectPanel = document.getElementById("selectPanel")
      	if (selectPanel) {
			const branchBox = selectPanel.childNodes[0].childNodes[1].childNodes[1].childNodes[0]
			// const allBranches = JSON.parse(localStorage.getItem("ref-selector:mattermost/mattermost:branch"))['refs']
			// console.log(branchBox.childNodes.length)
			branchBox.childNodes.forEach(element => {
				// console.log(element.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.childNodes[1].firstChild.textContent)
				element.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.childNodes[1].firstChild.textContent += "oo"
			});
		}
	})
})
  
observer.observe(document.body, {
	childList: true,
	subtree: true,
	attributes: false,
	characterData: false
})