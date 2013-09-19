	var write ;
	var bgimagesInHash = new Array();
	var ulInstance_pikame;
	var imageSelectedSrc, previousImageState;
	$(document).ready(function() {
		$("#settingsForBGImgChange").click(loadOnFirstClick);
	});

	function loadImages(theCallBackFunction) {
		previousImageState = $("#container").css(
				'background-image');
		write = false;
		var ul = $('<ul/>').attr('id', 'pikame');
		for ( var i = 0; i < bgimagesInHash.length; i++) {
			var imagenow = bgimagesInHash[i];
			okAnchor = $('<a/>', {
				id : imagenow.id
			});
			span = $('<span/>');
			$('<li/>').append(imagenow).append(span).appendTo(ul);
		}
		
		ulInstance_pikame = ul;
		theCallBackFunction();
	}

	var runningInstance;
	function enableSettings(event) { 
		$('#divHolder').dialog(
				{
					closeOnEscape : false, 
					resizable: false,
					modal : true,
					width : 560,
					position : "top",
					dialogClass : "st_shadow",
					buttons : [ {
						"class" : 'button orange_btn ok_btn',
						text : toUnicode("OK"),
						click : function() {
							write = true;
							$(this).dialog("close");
						}
					}, {
						"class" : 'button red_btn x_btn',
						text : toUnicode("Cancel "),
						click : function() {
							$(this).dialog("close");
						}
					} ],
					open : function(event, ui) {
						if (runningInstance == undefined) {
							$('#pikachoose').append(ulInstance_pikame);
							
							$("#pikame").PikaChoose({
								autoPlay : false,
								IESafe : true,
								animationFinished : bindClickToImage,
								buildThumbFinish : alignThumbNails
							});
						} else {
							$('#pikachoose').append(runningInstance);
							$('#pikame').data('pikachoose').Next();
						}
						var myPosition = $(this).offset();
						var newLeft = myPosition.left;
						var newTop = myPosition.top;
						jQuery(this).dialog("option", "position",
								[ newLeft, newTop + 30 ]);
						$("#divHolder").css("background-color", "#EEEEEE");

					},
					close : function(event, ui) {
						runningInstance = $("#pikame").detach();
							
						if (write) {
							write = false;
							previousImageState = $("#container").css('background-image');
							updateUserPref({
								backgroundImageId :  imageSelectedSrc.replace(/(\?+\d*)+/,"")
							});
							
						} else {
							$("#container").css('background-image',
									previousImageState);
						}
					}
				});
	}
	function bindClickToImage(selfImage) {
		imageSelectedSrc = selfImage.image.attr("src");
		selfImage.image.unbind('click', bgimageOnClickBind).bind('click',
				bgimageOnClickBind);
		srcFull = $("#container").css("background-image").replace(
				/images.backgrounds.\d{1,2}\.png/i, imageSelectedSrc);
		$("#container").css('background-image', srcFull);
	}

	function bgimageOnClickBind(event) {
		if(imageSelectedSrc!=previousImageState)
			write = true;
		$('#divHolder').dialog('close');
	}
	function alignThumbNails(selfImage) {
		$(".pika-thumbs").css("padding", "0 16px");
		$(".clip img").css({
			"width" : "95%",
			"height" : "95%",
			"text-align" : "justify"
		});
	}
	
	function loadImagesSingelton(theCallBackFunction) {
		imageSelectedSrc= $("#container").css(
				'background-image');
		var temp;
		temp= "1.png,2.png,3.png,4.png,5.png,6.png,7.png,8.png,9.png,10.png,11.png,12.png,13.png,14.png,15.png";
		if ($.trim(temp).length == 0)
			temp = "1.png";
		namesOfBgImages = temp.split(',');
		var actualLength = namesOfBgImages.length;
		$.each(namesOfBgImages, function(index, value) { 
		 url = 'images/backgrounds/' + $.trim(value); 
		 image = $('<img>')
					.load(
							'images/backgrounds/' + $.trim(value),
							function(response, status, xhr) {
								if (status == "error") {
									--actualLength;
								} else {
									$(this).attr('src', 'images/backgrounds/' + $.trim(value));
									$(this).attr('id', "IMAGE" + index);
									bgimagesInHash[bgimagesInHash.length] = $(this);
									if (bgimagesInHash.length == actualLength) {
										loadImages(theCallBackFunction);
									}
								}
							});
		});

	}
	
	var theCallBackFunction_=function(){ 
		$("#LoadingToBeDeleted_IMGLOAD").detach();
		enableSettings();
		$("#settingsForBGImgChange").unbind();
		$("#settingsForBGImgChange").bind("click",enableSettings);
	};
	var loadOnFirstClick= function (event){
	if($("#LoadingToBeDeleted_IMGLOAD").size()==0){
		$(this).unbind();
		$(this).html("<img id='LoadingToBeDeleted_IMGLOAD' src='images/loading.gif' /><span>"+$(this).html());
		loadImagesSingelton(theCallBackFunction_); 
	} 
	};
