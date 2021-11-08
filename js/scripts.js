/*!
* Start Bootstrap - Clean Blog v6.0.7 (https://startbootstrap.com/theme/clean-blog)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-clean-blog/blob/master/LICENSE)
*/

// Global Variables
var grid;
var msnry;
const api = "https://general-assignment.cacheuseonly.workers.dev/posts"
var KVCursor = null;
var completed = false;
var imgBase64 = null;

init = () => {
    grid = document.querySelector('.grid');
    msnry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: 50,
        gutter: 15
    });
    loadMore();
}

async function getPosts(callback) {
    let query = { cursor: KVCursor }
    $.ajax({
        type: "GET",
        url: api + "?" + $.param(query),
        success: callback,
    })
}

appendPost = (image, title, content) => {
    existImg = (image !== undefined && image !== null)
    var fragment = document.createDocumentFragment();
    var div = document.createElement("div");
    div.setAttribute("class", "grid-item");

    if (existImg) {
        let img = document.createElement("img")
        img.setAttribute("src", image)
        img.setAttribute("class", "img-fluid")
        div.appendChild(img)
    }
    let b = document.createElement("b")
    b.append(title)
    let p = document.createElement("p")
    p.append(content)
    div.appendChild(b)
    div.appendChild(p)

    fragment.appendChild(div);
    grid.appendChild(fragment);
    msnry.appended(div);
}

async function loadMore() {
    if (completed) {
        $('#completed').toast('show')
    } else {
        var data = [];
        getPosts((res) => {
            console.log("res: ", res)
            parsed = res
            // Update cursor
            if (parsed["cursor"] !== null) {
                KVCursor = parsed["cursor"]
            }
            // Update completeness
            completed = parsed["completed"]
            // Update posts
            posts = parsed["posts"]
            let len = posts.length;
            for (let i = 0; i < len; ++i) {
                data.push(JSON.parse(posts[i]))
            }
            for (var i = 0; i < len; ++i) {
                appendPost(data[i]["image"], data[i]["title"], data[i]["content"])
            }
        });
    }
}

submitForm = () => {
    let Title = $("#post-title").val();
    let Content = $("#post-content").val();
    let img = imgBase64
    var data = { title: Title, content: Content, image: img }
    $.ajax({
        type: "POST",
        url: api,
        data: JSON.stringify(data),
        headers: { 'Access-Control-Allow-Origin': '*' },
        success: function (data, status) {
            console.log("data: ", data, " status: ", status)
            $('success').toast('show')
        },
        dataType: "json",
    })
}

function toBase64(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        console.log('RESULT', reader.result)
        imgBase64 = reader.result
    }
    reader.readAsDataURL(file);
}