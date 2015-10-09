/**
 *	Neon Notes Script
 *
 *	Developed by Arlind Nushi - www.laborator.co
 */

var resultsonairNotes = resultsonairNotes || {};

;(function($, window, undefined)
{
	"use strict";

	$(window).load(function()
	{
		resultsonairNotes.$container = $(".notes-env");

		$.extend(resultsonairNotes, {
			isPresent: resultsonairNotes.$container.length > 0,

			noTitleText: "Untitled",
			noDescriptionText: "(No content)",


			$currentNote: $(null),
			$currentNoteTitle: $(null),
			$currentNoteDescription: $(null),
			$currentNoteContent: $(null),

			addNote: function()
			{
				var $note = $('<li><a href="#"><strong></strong><span></li></a></li>');

				$note.append('<div class="content"></div>').append('<button class="note-close">&times;</button>');

				$note.find('strong').html(resultsonairNotes.noTitleText);
				$note.find('span').html(resultsonairNotes.noDescriptionText);

				resultsonairNotes.$notesList.prepend($note);

				TweenMax.set($note, {autoAlpha: 0});

				var tl = new TimelineMax();

				tl.append( TweenMax.to($note, .10, {css: {autoAlpha: 1}}) );
				tl.append( TweenMax.to($note, .15, {css: {autoAlpha: .8}}) );
				tl.append( TweenMax.to($note, .15, {css: {autoAlpha: 1}}) );

				resultsonairNotes.$notesList.find('li').removeClass('current');
				$note.addClass('current');

				resultsonairNotes.$writePadTxt.focus();

				resultsonairNotes.checkCurrentNote();
			},

			checkCurrentNote: function()
			{
				var $current_note = resultsonairNotes.$notesList.find('li.current').first();

				if($current_note.length)
				{
					resultsonairNotes.$currentNote             = $current_note;
					resultsonairNotes.$currentNoteTitle        = $current_note.find('strong');
					resultsonairNotes.$currentNoteDescription  = $current_note.find('span');
					resultsonairNotes.$currentNoteContent      = $current_note.find('.content');

					resultsonairNotes.$writePadTxt.val( $.trim( resultsonairNotes.$currentNoteContent.html() ) ).trigger('autosize.resize');;
				}
				else
				{
					var first = resultsonairNotes.$notesList.find('li:first:not(.no-notes)');

					if(first.length)
					{
						first.addClass('current');
						resultsonairNotes.checkCurrentNote();
					}
					else
					{
						resultsonairNotes.$writePadTxt.val('');
						resultsonairNotes.$currentNote = $(null);
						resultsonairNotes.$currentNoteTitle = $(null);
						resultsonairNotes.$currentNoteDescription = $(null);
						resultsonairNotes.$currentNoteContent = $(null);
					}
				}
			},

			updateCurrentNoteText: function()
			{
				var text = $.trim( resultsonairNotes.$writePadTxt.val() );

				if(resultsonairNotes.$currentNote.length)
				{
					var title = '',
						description = '';

					if(text.length)
					{
						var _text = text.split("\n"), currline = 1;

						for(var i=0; i<_text.length; i++)
						{
							if(_text[i])
							{
								if(currline == 1)
								{
									title = _text[i];
								}
								else
								if(currline == 2)
								{
									description = _text[i];
								}

								currline++;
							}

							if(currline > 2)
								break;
						}
					}

					resultsonairNotes.$currentNoteTitle.text( title.length ? title : resultsonairNotes.noTitleText );
					resultsonairNotes.$currentNoteDescription.text( description.length ? description : resultsonairNotes.noDescriptionText );
					resultsonairNotes.$currentNoteContent.text( text );
				}
				else
				if(text.length)
				{
					resultsonairNotes.addNote();
				}
			}
		});

		// Mail Container Height fit with the document
		if(resultsonairNotes.isPresent)
		{
			resultsonairNotes.$notesList = resultsonairNotes.$container.find('.list-of-notes');
			resultsonairNotes.$writePad = resultsonairNotes.$container.find('.write-pad');
			resultsonairNotes.$writePadTxt = resultsonairNotes.$writePad.find('textarea');

			resultsonairNotes.$addNote = resultsonairNotes.$container.find('#add-note');

			resultsonairNotes.$addNote.on('click', function(ev)
			{
				resultsonairNotes.addNote();
			});

			resultsonairNotes.$writePadTxt.on('keyup', function(ev)
			{
				resultsonairNotes.updateCurrentNoteText();
			});

			resultsonairNotes.checkCurrentNote();

			resultsonairNotes.$notesList.on('click', 'li a', function(ev)
			{
				ev.preventDefault();

				resultsonairNotes.$notesList.find('li').removeClass('current');
				$(this).parent().addClass('current');

				resultsonairNotes.checkCurrentNote();


			});

			resultsonairNotes.$notesList.on('click', 'li .note-close', function(ev)
			{
				ev.preventDefault();

				var $note = $(this).parent();

				var tl = new TimelineMax();

				tl.append(
					TweenMax.to($note, .15, {css: {autoAlpha: 0}, onComplete: function()
					{
						$note.remove();
						resultsonairNotes.checkCurrentNote();
					}})
				);
			});
		}
	});

})(jQuery, window);

