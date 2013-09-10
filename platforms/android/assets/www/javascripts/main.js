$(document).ready(function() {

    var showQuestionButton = document.getElementById('show-question-button');

    $(showQuestionButton).hide();

});

$(document).on('click', '#show-answer-button', function(event) {
    event.preventDefault();
    var qnaPanel = document.getElementById('qna-panel');
    if ($(qnaPanel).attr('name') !== 'empty') {
        var showQuestionButton = document.getElementById('show-question-button');
        var qnaPanelNote = $(qnaPanel).attr('note');
        $(qnaPanel).html($('#qna-panel').attr('answer'));
        if (qnaPanelNote) {
            $(qnaPanel).append('<br/><strong>Note:</strong><br/>' + $(qnaPanel).attr('note'));
        }
        $(this).hide();
        $(showQuestionButton).show();
    }
    else {
        alert('Question list is empty.');
    }
});

$(document).on('click', '#show-question-button', function(event) {
    var qnaPanel = document.getElementById('qna-panel');
    var showAnswerButton = document.getElementById('show-answer-button');
    $(qnaPanel).html($('#qna-panel').attr('question'));
    $(this).hide();
    $(showAnswerButton).show();
});

$(document).on('click', '#next-button', function(event) {
    event.preventDefault();
    var qnaPanel = document.getElementById('qna-panel');
    if ($(qnaPanel).attr('name') !== 'empty') {
        var nextSequence = parseInt($(qnaPanel).attr('sequence')) + 1;
        var nextQuestion = $('.question[sequence="' + nextSequence +'"]');

        if (parseInt($(qnaPanel).attr('sequence')) ===  $('.question').size() -1) {
            alert('That was the last question.  Your ninja skills have improved by ten points.');
        }

        if (parseInt($(qnaPanel).attr('sequence')) !==  $('.question').size() -1) {
            $(qnaPanel).attr('sequence', parseInt($(qnaPanel).attr('sequence')) + 1);
            setQnaPanel(nextQuestion);
        }

        var showAnswerButton = document.getElementById('show-answer-button');
        var showQuestionButton = document.getElementById('show-question-button');
        $(showAnswerButton).show();
        $(showQuestionButton).hide();
    }
    else {
        alert('Question list is empty.');
    }
});

$(document).on('click', '#prev-button', function(event) {
    event.preventDefault();
    var qnaPanel = document.getElementById('qna-panel');
    if ($(qnaPanel).attr('name') !== 'empty') {
        var prevSequence = parseInt($(qnaPanel).attr('sequence')) - 1;
        var prevQuestion = $('.question[sequence="' + prevSequence +'"]');

        if ((parseInt($(qnaPanel).attr('sequence')) - 1) === -1) {
            alert('Oops...this is the first question.  Go the other way.');
        }

        if ((parseInt($(qnaPanel).attr('sequence')) - 1) !== -1) {
            $(qnaPanel).attr('sequence', parseInt($(qnaPanel).attr('sequence')) - 1);
            setQnaPanel(prevQuestion);
        }

        var showAnswerButton = document.getElementById('show-answer-button');
        var showQuestionButton = document.getElementById('show-question-button');

        $(showAnswerButton).show();
        $(showQuestionButton).hide();
    }
    else {
        alert('Question list is empty.');
    }
});

// Quick select list click.
$(document).on('click', '#quick-select-list .quick-select-link', function(event) {
    //event.preventDefault();
    var sequence = parseInt($(this).attr('sequence'));
    var theQuestion = $('.question[sequence="' + sequence +'"]');
    var showAnswerButton = document.getElementById('show-answer-button');
    var showQuestionButton = document.getElementById('show-question-button');

    setQnaPanel(theQuestion);

    $(showAnswerButton).show();
    $(showQuestionButton).hide();
});

// Bookmark it.
$(document).on('click', '#mark-it',function() {
    var qnaPanel = document.getElementById('qna-panel');

    if ($(qnaPanel).attr('name') !== 'empty') {
        var markedUl = document.getElementById('marked-ul');
        var marked = JSON.parse(localStorage.getItem('marked'));
        var questionName = $(qnaPanel).attr('name');
        var theQuestion = $('.question[name="'+ questionName + '"]');
        var questionValue = $(theQuestion).val();
        var questionAnswer = $(theQuestion).attr('answer');
        var questionNote = $(theQuestion).attr('note');

        $(markedUl).html('');
        marked.push({
            name: questionName,
            value: questionValue,
            answer: questionAnswer,
            note: questionNote
        });
        localStorage.setItem('marked', JSON.stringify(marked));

        var newMarked = JSON.parse(localStorage.getItem('marked'));
        for (var i = 0; i < newMarked.length; i++) {
            $(markedUl).append('<li>' + newMarked[i].value +
                    '&nbsp;<a href="#" class="label secondary small mark-it-remove" sequence="' +
                    i + '">Remove</a></li>');
        }
    }
    else {
        alert('Question list is empty.');
    }
});

// Remove marked.
$(document).on('click', '#marked-ul .mark-it-remove',function(event) {
    event.preventDefault();

    var marked = JSON.parse(localStorage.getItem('marked'));
    var sequence = parseInt($(this).attr('sequence'));

    marked.splice(sequence, 1);

    localStorage.setItem('marked', JSON.stringify(marked));

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
});