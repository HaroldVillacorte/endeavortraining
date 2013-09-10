// Functions.
replaceQuotes = function(string) {
    return string.replace(/"/g, '&quot;');
};

setQnaPanel = function(question) {
    var qnaPanel = document.getElementById('qna-panel');
    var showQuestionButton = document.getElementById('show-question-button');
    var showAnswerButton = document.getElementById('show-answer-button');
    $(qnaPanel).html($(question).val());
    $(qnaPanel).attr('name', $(question).attr('name'));
    $(qnaPanel).attr('question', $(question).val());
    $(qnaPanel).attr('answer', $(question).attr('answer'));
    $(qnaPanel).attr('note', $(question).attr('note'));
    $(qnaPanel).attr('sequence', $(question).attr('sequence'));
    $(showQuestionButton).hide();
    $(showAnswerButton).show();
};

clearQnaPanel = function() {
    var qnaPanel = document.getElementById('qna-panel');
    var showQuestionButton = document.getElementById('show-question-button');
    var showAnswerButton = document.getElementById('show-answer-button');
    $(qnaPanel).html('Question list is empty.');
    $(qnaPanel).attr('name', 'empty');
    $(qnaPanel).removeAttr('question');
    $(qnaPanel).removeAttr('answer');
    $(qnaPanel).removeAttr('note');
    $(qnaPanel).removeAttr('sequence');
    $(showQuestionButton).hide();
    $(showAnswerButton).show();
};

setQuickSelectList = function() {
    var questions = $('.question');
    var quickSelectList = document.getElementById('quick-select-list');
    var quickSelectListLi = quickSelectList.getElementsByTagName('li');
    $(quickSelectListLi).each(function() {
        $(this).remove();
    });
    for (var i = 0; i < questions.length; i++) {
        $(quickSelectList).append('<li><a href="#" sequence=' +
                i + ' class="quick-select-link">' +
                $(questions[i]).val() + '</a></li>');
    }
};

setBookmarked = function() {
    var bookmarkedQuestionList = document.getElementById('bookmarked-question-list');
    if (bookmarkedQuestionList) {
        $(bookmarkedQuestionList).html('');
        var bookmarkedQuestions = JSON.parse(localStorage.getItem('marked'));
        for (var i = 0; i < bookmarkedQuestions.length; i++) {
            var questionInput = '<input type="hidden" class="question"' +
                    ' name="' + bookmarkedQuestions[i].name + '"' +
                    ' value="' + replaceQuotes(bookmarkedQuestions[i].value) + '"' +
                    ' answer="' + replaceQuotes(bookmarkedQuestions[i].answer) + '"' +
                    ' note="' + replaceQuotes(bookmarkedQuestions[i].note) + '"' +
                    ' sequence="' + i + '" />';
            $('#bookmarked-question-list').append(questionInput);
        }
    }
};

setMarked = function() {
    var markedUl = document.getElementById('marked-ul');
    if (!localStorage.getItem('marked')) {
        var marked = [];
        localStorage.setItem('marked', JSON.stringify(marked));
    }
    else {
        var marked = JSON.parse(localStorage.getItem('marked'));
    }
    $(markedUl).html('');
    for (var i = 0; i < marked.length; i++) {
        $(markedUl).append('<li>' + marked[i].value +
                '&nbsp;<a href="#" class="label secondary small mark-it-remove" sequence="' +
                i + '">Remove</a></li>');
    }
};

function showBusy()
{
   $('#ajax-content').html('<div><img id="load-gif" src="images/load.gif" /></div>');
}

function updateSettingsPage(html) {
   $('#ajax-content').hide().html(html).fadeIn();
   $('#input-username').val(localStorage.getItem('username'));
   $('#input-apikey').val(localStorage.getItem('apiKey'));
   if ($('#top-bar').hasClass('expanded')) {
       $('#top-bar').removeClass('expanded');
   };
}

function updateQuestionsPage(html, categoryId, categoryName) {
    var allQuestions = JSON.parse(localStorage.getItem('questions'));
    var questions = [];

    for (i = 0; i < allQuestions.length; i++) {
        if (allQuestions[i].categoryId === categoryId) {
            questions.push(allQuestions[i]);
        }
    }

    $('#ajax-content').hide().html(html).fadeIn();
    for (i = 0; i < questions.length; i++) {
        if (questions[i].categoryId === categoryId) {
            $('#question-list').append('<input class="question" type="hidden" sequence="' +
                    i + '" note="' + questions[i].note + '" answer="' +
                    questions[i].answer + '" value="' + questions[i].question +
                    '" name="question-' + questions[i].id + '">');
        }
    }

    var showQuestionButton = document.getElementById('show-question-button');

    $(showQuestionButton).hide();

    setBookmarked();

    setMarked();

    setQuickSelectList();

    var questions = $('.question');
    if (questions.length > 0) {
        setQnaPanel(questions[0]);
    }
    else if (questions.length === 0 || !questions) {
        clearQnaPanel();
    }

    $('#category-title').html(categoryName);
    if ($('#top-bar').hasClass('expanded')) {
        $('#toggle-topbar').click();
    };
}

function showFail()
{
    $('#ajax-content').html('<div>There was problem getting the data.</div>');
}
