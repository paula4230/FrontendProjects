const API_KEY = 'AIzaSyArFhANdsXDKGZbqO1gbRbNFvqdXscS0T8'
const API_KEY_MED = 'f2579928-fd88-46fd-90ed-d9b536666a3e'
const API_KEY_CORE = 'pvXql0OaRP6GVnb7wKCzJtQ492ILirNT'





//fetches the APIs for each query on click
document.getElementById('formchannel').addEventListener('submit', e => {
    let topic = document.getElementById('topic')
    e.preventDefault()
    console.log('clicked')

    const searchtitle = enterfield.value

    getVideo(API_KEY,searchtitle,1)
    getDefinition(API_KEY_MED, searchtitle)
    getArticles(API_KEY_CORE, searchtitle)

    topic.innerHTML = searchtitle.toUpperCase()
    createTitles()
    document.getElementById('poster').style.display ='none'
})

//VIDEO API

async function getVideo(key,title,maxResults){
    let videoContainer = document.getElementById('videoContainer')
    let response = await fetch('https://www.googleapis.com/youtube/v3/search?key=' + key + '&type=video&part=snippet&maxResults=' + maxResults + '&q=' + title, function(data){
        // console.log(data)
    })
    // console.log(response)
    
    if (response.ok){
        let videos = await response.json()    
        // console.log(videos)

        let videoArray = videos.items
        // console.log(videoArray)

        videoArray.forEach(video =>{
            let vidID = video.id.videoId
            // console.log(vidID)
            let vidclip = `<iframe id='video' width='100%' height='100%'src='https://www.youtube.com/embed/${vidID}' frameborder='0'allowfullscreen></iframe>`
            // console.log(vidclip)

            videoContainer.innerHTML = vidclip          
        })
    } else {
        alert('HTTP-Error' + response.status);
        // console.log('error')
    }   
}

// //DICTIONARY API

let meaning = document.getElementById('meaning')

async function getDefinition(key2, title){
    let response = await fetch('https://www.dictionaryapi.com/api/v3/references/medical/json/' + title + '?key=' + key2)
    // console.log(response)
    
    if (response.ok){
        let info = await response.json()    
        let definition = info[0].shortdef[0]
        // console.log(info)
        // console.log(definition)

        meaning.innerText = definition

    } else {
        alert('HTTP-Error' + response.status);
        // console.log('error')
    }   
}

//List OF ARTICLES API

let titleArray = new Array()

async function getArticles(key3, title){
    let response = await fetch(`https://core.ac.uk:443/api-v2/journals/search/` + title + `?page=1&pageSize=10&apiKey=`+ key3)
    // console.log(response)
    
    if (response.ok){
        let info = await response.json()     

        let data = info.data
        data.forEach(element => {
            let title = element.title
            titleArray.push(title)
        })
        createTitleArray()
    } else {
        alert('HTTP-Error' + response.status);
        // console.log('error')
    }   
}

function createTitleArray () { //creates a list of articles with their given titles for the UI
    let articles = document.getElementById('articles')
    let titleContainer = document.createElement('div')
    let titleElement = document.createElement('ul')
    articles.appendChild(titleContainer)
    titleContainer.appendChild(titleElement)

    for (i=0; i < titleArray.length; i++){
        listLi = document.createElement('li')
        listTitle = document.createElement('a')
        listTitle.href = `https://doaj.org/search/journals?ref=homepage-box&source=%7B"query"%3A%7B"query_string"%3A%7B"query"%3A ${titleArray[i]} %2C"default_operator"%3A"AND"%7D%7D%7D` // anchors to new browswer but spaces must be changed to %20
        // document.write(encodeURIComponent(listTitle.trim()))
        listTitle.target = '_blank';
        console.log(listTitle)
        listTitle.innerText = titleArray[i]

        titleElement.appendChild(listLi)
        listLi.appendChild(listTitle)
    }
}


function createTitles() { //creates the headers for the APIs categories to be fetched

    let meaningheader = document.getElementById('meaningheader')
    let articleheader = document.getElementById('articleheader')

    meaningheader.innerText = "Definition"
    articleheader.innerText = "Related Research Articles"

}

