var editId;
function taskList(newPage, deleted)
{
    $.get('http://127.0.0.1:8000/api/todolist?isDeleted='+ deleted +'&page='+newPage, function(data, textStatus) {
        $('#list-items > tr').remove();
        $('.pagination > li').remove();
        jQuery.each(data.data, function(i, val) {
            $("#list-items").append('<tr id="' + val.id + '"><th scope="row">' + val.id + '</th><td>' + val.title + '</td><td>' + val.description + '</td><td>' + ((val.isDone != 1) ? "-" : "Tamamlandı") + '</td><td><button type="button" class="btn btn-primary openEdit" data-id="'+val.id+'" data-title="'+val.title+'" data-description="'+val.description+'">Düzenle</button><button class="btn btn-danger delete" data-id="' + val.id + '">Sil</button></td></tr>');
        });
        var lastPage = data.meta.last_page;
        var page = data.meta.current_page;
        if (page !== 1)
        {
            $('.pagination').append('<li class="page-item"><a class="page-link" href="#" data-page="'+ (page-1) +'" data-isDeleted='+ deleted +'">Previous</a></li>');
        }
        for(var i = 1; i <= lastPage; i++)
        {
            $('.pagination').append('<li class="page-item'+ (i === page ? " active":"")+'"><a class="page-link" href="#" data-page="'+ i +'" data-isDeleted='+ deleted +'">'+i+'</a></li>');
        }
        if (page !== lastPage)
        {
            $('.pagination').append('<li class="page-item"><a class="page-link" href="#" data-page="'+ (page+1) +'" data-isDeleted='+ deleted +'">Next</a></li>');
        }

    });
}

$(document).ready(function() {
    //Task List
    taskList(1, 0);

    //Add New Task
    $('#submit').on('click', function() {
        var title = $("#exampleInputText1").val();
        var description = $("#exampleInputDescription1").val();

        $.post('http://127.0.0.1:8000/api/todolist', // url
            {
                title: title,
                description: description
            }, // data to be submit
            function(data, status) { // success callback
                location.reload();
            })
    })
});

$(document).ajaxComplete(function(event, request, settings) {
    //Task Mark Deleted
    $(".delete").on("click", function() {
        var id = $(this).data('id');
        $.ajax({
            url: 'http://127.0.0.1:8000/api/todolist/' + id,
            type: 'DELETE',
            success: function(result) {
                $("#" + id).remove();
                alert("Silindi.");
            }
        });
    });

    //Task Edit
    $('#edit').on('click', function() {
        var title = $("#inputTitle").val();
        var description = $("#inputDescription").val();

        $.ajax({
            url: 'http://127.0.0.1:8000/api/todolist/'+editId,
            data:{
                'title':title,
                'description':description
            },
            type: 'PATCH',
            success: function(result) {
                location.reload();
            }
        });

    });

    //Open Edit Popup
    $('.openEdit').on('click',function(){
        var id = $(this).data("id");
        var title = $(this).data("title");
        var description = $(this).data("description");

        $('#open-edit').modal({show:true});
        $('#inputTitle').val(title);
        $('#inputDescription').val(description);

        editId=id;
    });

    //Pagination
    $('.page-link').on('click',function(){
       var newPage = $(this).data("page");
       var isDeleted = $(this).data("isDeleted");

       taskList(newPage, isDeleted);
    });

    //Deleted Task
    $('.deleted').on('click',function(){
       taskList(1, 1);
    });

});