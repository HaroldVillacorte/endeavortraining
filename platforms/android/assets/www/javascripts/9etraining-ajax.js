$(document).ready(function() {

    $('.settings-link').click(function(event) {
        event.preventDefault();
        var link = $(this).attr('href');
        $.ajax({
            url: link,
            type: 'GET',
            dataType: 'html',
            beforeSend: function()
            {
              showBusy();
            },
            success: function(html)
            {
              updateSettingsPage(html);
            }
        });
    });

    try {
        var domains = JSON.parse(localStorage.getItem('domains'));
        var categories = JSON.parse(localStorage.getItem('categories'));
    } catch (e) {
        return true;
    }

    // Set the Domain menus.
    if (domains !== null) {
        $('#settings-front').before('<ul class="accordion" id="front-accordion"></ul>');
        for (i = 0; i < domains.length; i++) {
            $('#study-links').append('<li class="has-dropdown domain-link" domainid="' +
                    domains[i].id + '"><a href="#">' + domains[i].name +
                    '</a><ul class="dropdown" id="domain-' + domains[i].id +
                    '"></ul></li><li class="divider"></li>');
            $('#front-accordion').append('<li><div class="title"><h5>' +
                    domains[i].name + '</h5></div><div class="content"><ul id="front-domain-' +
                    domains[i].id + '"></ul></div></li>');
        };
    }

    // Set the Category menus.
    if (categories !== null) {
        for (i = 0; i < categories.length; i++) {
            var UlDomain = $('#domain-' + categories[i].domainId);
            $(UlDomain).append('<li><a href="pages/questions.html" class="question-link" categoryid="' +
                    categories[i].id + '" categoryname="' + categories[i].name + '">' +
                    categories[i].name + '</a></li><li class="divider"></li>');
            var frontDomain = document.getElementById('front-domain-' + categories[i].domainId);
            $(frontDomain).append('<li><a href="pages/questions.html" class="question-link" categoryid="'+
                    categories[i].id + '" categoryname="' +
                    categories[i].name+'">' + categories[i].name + '</a></li>');
        }
    }
});

$(document).on('click', '.question-link', function(event) {
    event.preventDefault();

    var link = $(this).attr('href');
    var categoryId = parseInt($(this).attr('categoryid'));
    var categoryName = $(this).attr('categoryname');

    $.ajax({
        url: link,
        type: 'GET',
        dataType: 'html',
        beforeSend: function()
        {
            showBusy();
        },
        success: function(html)
        {
            updateQuestionsPage(html, categoryId, categoryName);
        }
    });
});

$(document).on('click', '.marked-link', function(event) {
    event.preventDefault();

    var link = $(this).attr('href');

    $.ajax({
        url: link,
        type: 'GET',
        dataType: 'html',
        beforeSend: function()
        {
            showBusy();
        },
        success: function(html)
        {
        	var marked = localStorage.getItem('marked');
        	if (marked) {
        		var categoryId, categoryName;
        		updateQuestionsPage(html, categoryId, categoryName);
        	}
        	else {
        		$('#ajax-content').html('<h2>Bookmarked Questions</h2><p>You have no bookmarked questions.</p>');
        	}
        }
    });
});

$(document).on('submit', '#login-form', function(event) {
    event.preventDefault();

    var ajaxHtml = $('#ajax-content').html();
    var username = $('#input-username').val();
    var apiKey = $('#input-apikey').val();

    // Saveusername and password.
    if (typeof(localStorage) === 'undefined' )
    {
        alert('Your browser does not support HTML5 localStorage. Try upgrading.');
    }
    else
    {
        try
        {
            localStorage.setItem('username', username);
            localStorage.setItem('apiKey', apiKey);
            updateSettingsPage(ajaxHtml);
            $('#messages').html('Username and api key saved successfully.<a href="" class="close">&times;</a>');
            $('#messages').removeClass('alert');
            $('#messages').addClass('alert-box success');
        }
        catch (e)
        {
            alert(e);
            updateSettingsPage(ajaxHtml);
            $('#messages').html('There was a problem saving the username and api key.<a href="" class="close">&times;</a>');
            $('#messages').removeClass('success');
            $('#messages').addClass('alert-box alert');
        }
    }
});

$(document).on('click', '#sync-button', function(event) {
    event.preventDefault();
    document.addEventListener("deviceready", syncNow, false);
    
    function syncNow() {
    	var connectionType = navigator.connection.type;
	    if (connectionType == Connection.NONE) {
	    	alert('It seems you are not connected to a network.');
	    }
	    else {
		    var ajaxHtml = $('#ajax-content').html();
		    var username = localStorage.getItem('username');
		    var apiKey = localStorage.getItem('apiKey');
		
		    var data = {username:username, apiKey:apiKey};
		
		    $.ajax({
		        type: 'POST',
		        dataType: 'json',
		        url: 'http://9etraining.laughinghost.com/study-rest',
		        data: data,
		        beforeSend: function()
		        {
		          showBusy();
		        },
		        success: function(data)
		        {
		            if (data.data === 'user') {
		                updateSettingsPage(ajaxHtml);
		                $('#messages').html('Username was not found.<a href="" class="close">&times;</a>');
		                $('#messages').removeClass('success');
		                $('#messages').addClass('alert-box alert');
		            }
		            else if (data.data === 'key') {
		                updateSettingsPage(ajaxHtml);
		                $('#messages').html('Api key was not found.<a href="" class="close">&times;</a>');
		                $('#messages').removeClass('success');
		                $('#messages').addClass('alert-box alert');
		            }
		            else {
		                localStorage.setItem('domains', JSON.stringify(data.data.domains));
		                localStorage.setItem('categories', JSON.stringify(data.data.categories));
		                localStorage.setItem('questions', JSON.stringify(data.data.questions));
		                try {
		                    var domains = JSON.parse(localStorage.getItem('domains'));
		                    var categories = JSON.parse(localStorage.getItem('categories'));
		                    var questions = JSON.parse(localStorage.getItem('questions'));
		                } catch (e) {
		                    showFail();
		                }
		
		                // Remove menus.
		                $('#study-links li').remove();
		                $('#study-links').append('<li class="divider"></li>');
		
		                // Set the domain menus.
		                for (i = 0; i < domains.length; i++) {
		                    $('#study-links').append('<li class="has-dropdown domain-link" domainid="' +
		                            domains[i].id + '"><a href="#">' + domains[i].name +
		                            '</a><ul class="dropdown" id="domain-' + domains[i].id +
		                            '"></ul></li><li class="divider"></li>');
		                };
		                // Set the Category menus.
		                for (i = 0; i < categories.length; i++) {
		                    var UlDomain = $('#domain-' + categories[i].domainId);
		                    $(UlDomain).append('<li><a href="pages/questions.html" class="question-link" categoryid="' +
		                            categories[i].id + '" categoryname="' + categories[i].name + '">' +
		                            categories[i].name + '</a></li><li class="divider"></li>');
		                }
		
		                updateSettingsPage(ajaxHtml);
		
		                if (domains.length > 0 && categories.length > 0 && questions.length > 0) {
		                    $("#sync-modal").reveal();
		                }
		            }
		        }
		    });
        }
    }
});

$(document).on('click', '#sync-refresh-button', function() {
    window.location.reload();
});
