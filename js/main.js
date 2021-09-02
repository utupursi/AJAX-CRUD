function persons() {
    $.ajax({
        url: 'persons.php?type=index',
        method: "GET",
        success: function (data) {
            $('#person-tbody').empty();
            data.forEach(item => {
                let r = `
          <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.surname}</td>
          <td>${item.age}</td>
          <td>${item.gender}</td>
          <td>
          <button id="${item.id}" data-toggle="modal" data-target="#myModal" class="btn btn-info" data-type="update">Update</button>
          <button id="${item.id}" data-toggle="modal" data-target="#showModal" class="btn btn-primary" data-type="show">Show</button>
          <button onclick="deletePerson(${item.id})" class="btn btn-danger delete-button">Delete</button>
</td>
          </tr>
       `
                $('#person-tbody').append(r);
            })
            console.log(data);
        },
    });
}


$('#submit-button').on('click', function () {
    if (validateForm()) {
        let object = {
            name: $('#name').val(),
            surname: $('#surname').val(),
            age: $('#age').val(),
            gender: $('#gender').val(),
        }
        console.log(object);
        $.ajax({
            url: 'persons.php?type=create',
            method: "POST",
            data: object,
            success: function (data) {
                $('#myModal').modal('toggle');
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data,
                })
                $('#person-form')[0].reset();
                persons();

            },
        });

    }
});

$('#update-button').on('click', function (e) {
    if (validateForm()) {
        let object = {
            name: $('#name').val(),
            surname: $('#surname').val(),
            age: $('#age').val(),
            gender: $('#gender').val(),
        }
        $.ajax({
            url: `persons.php?type=update&id=${e.target.getAttribute('data-id')}`,
            method: "POST",
            data: object,
            success: function (data) {
                $('#myModal').modal('toggle');
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data,
                })
                $('#person-form')[0].reset();
                persons();

            },
        });

    }
});

function deletePerson(id) {
    if (confirm('Are you really want to delete this item')) {
        $.ajax({
            url: `persons.php?type=delete&id=${id}`,
            method: "GET",
            success: function (data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data,
                })
                persons();
            },
        });
    }
}

$("#myModal").on('show.bs.modal', function (e) {
    $('#person-form')[0].reset();
    if (e.relatedTarget && e.relatedTarget.getAttribute('data-type') == 'update') {
        $('#submit-button').attr('hidden', '');
        $('#update-button').removeAttr('hidden');
        let button = document.querySelector('#update-button');
        if (button) {
            button.setAttribute('data-id', e.relatedTarget.id);
        }
        // $('#update-button').attr('id', e.relatedTarget.id);

        $('#name').next().attr('hidden', '');
        $('#surname').next().attr('hidden', '');
        $('#age').next().attr('hidden', '');

        $.ajax({
            url: `persons.php?type=getById&id=${e.relatedTarget.id}`,
            method: "GET",
            success: function (data) {
                $('#name').val(data.name);
                $('#surname').val(data.surname);
                $('#age').val(data.age);
                $('#gender').val(data.gender);
            },
        });
    } else {
        $('#update-button').attr('hidden', '');
        $('#submit-button').removeAttr('hidden');

    }
});


$("#showModal").on('show.bs.modal', function (e) {
    $.ajax({
        url: `persons.php?type=getById&id=${e.relatedTarget.id}`,
        method: "GET",
        success: function (data) {
            $('#name_1').val(data.name);
            $('#surname_1').val(data.surname);
            $('#age_1').val(data.age);
            $('#gender_1').val(data.gender);
        },
    });
});


$('#name').on('input', function () {
    validateName();
})

$('#surname').on('input', function () {
    validateSurname();

})

$('#age').on('input', function () {
    validateAge();
})

function validateForm(type = "all") {
    // $('#name').next().attr('hidden', '');
    // $('#name').next().text('Please fill out name')
    let valid = true;
    if (!validateName()) {
        valid = false;
    }
    if (!validateSurname()) {
        valid = false;
    }
    if (!validateAge()) {
        valid = false;
    }
    return valid;
}

function validateName() {
    $('#name').next().attr('hidden', '')
    if ($('#name').val() == "") {

        $('#name').next().removeAttr('hidden');
        $('#name').next().text('Please fill out name')
        return false;

    } else if ($('#name').val().length > 30) {
        $('#name').next().removeAttr('hidden');
        $('#name').next().text('Name must be less than 30 characters')
        return false;
    }

    return true;


}

function validateSurname() {

    $('#surname').next().attr('hidden', '')
    if ($('#surname').val() == "") {

        $('#surname').next().removeAttr('hidden');
        $('#surname').next().text('Please fill out name');
        return false;
    } else if ($('#name').val().length > 30) {
        $('#name').next().removeAttr('hidden');
        $('#name').next().text('Name must be less than 30 characters');
        return false
    }

    return true;
}

function validateAge() {
    $('#age').next().attr('hidden', '')
    if ($('#age').val() == "") {
        $('#age').next().removeAttr('hidden');
        $('#age').next().text('Please fill out name');
        return false;
    }
    return true;
}

persons();

//
// $('#modal').on('shown.bs.modal', function () {
//     $('#myInput').trigger('focus')
// })