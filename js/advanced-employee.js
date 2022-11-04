$(document).ready(function(){
	
	var tableEmployee = $('#table-employee').DataTable({
		"dom": 'Blfrtip',
		"autoWidth": false,
		"processing":true,
		"serverSide":true,
		"pageLength":15,
		"lengthMenu":[[15, 25, 50, 100, -1], [15, 25, 50, 100, "All"]],
		"responsive": true,
		"language": {processing: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>'},
		"order":[],
		"ajax":{
			url:"advanced-employee-action.php",
			type:"POST",
			data:{
					action:'listEmployees'
				},
			dataType:"json"
		},
		"columnDefs":[ {"targets":[0], "visible":false} ],
		"buttons": [
				{
					extend: 'excelHtml5',
					title: 'Employees',
					filename: 'Employees',
					exportOptions: {columns: [1,2,3,4,5,6]}
				},
				{
					extend: 'pdfHtml5',
					title: 'Employees',
					filename: 'Employees',
					exportOptions: {columns: [1,2,3,4,5,6]}
				},
				{
					extend: 'print',
					title: 'Employees',
					filename: 'Employees',
					exportOptions: {columns: [1,2,3,4,5,6]}
				}]
	});	
	
	$("#addEmployee").click(function(){
		$('#employee-form')[0].reset();
		$('#employee-modal').modal('show');
		$('.modal-title').html("Add Employee");

		$('#action').val('addEmployee');
		$('#save').val('Add');
	});
	
	$("#employee-modal").on('submit','#employee-form', function(event){
		event.preventDefault();
		$('#save').attr('disabled','disabled');
		$.ajax({
			url:"advanced-employee-action.php",
			method:"POST",
			data:{
				ID: $('#ID').val(),
				first_name: $('#first_name').val(),
				last_name: $('#last_name').val(),
				email_address: $('#email_address').val(),
				password: $('#password').val(),
				date_of_birth: $('#date_of_birth').val(),
				// Permission: $('#Permission').val(),
				Permission: $('#Permission').val(),
				action: $('#action').val(),
			},
			success:function(){
				$('#employee-modal').modal('hide');
				$('#employee-form')[0].reset();
				$('#save').attr('disabled', false);
				tableEmployee.ajax.reload();
			}
		})
	});		
	
	$("#table-employee").on('click', '.update', function(){
		var ID = $(this).attr("emp_id");
		var action = 'getEmployee';
		$.ajax({
			url:'advanced-employee-action.php',
			method:"POST",
			data:{ID:ID, action:action},
			dataType:"json",
			success:function(data){
				$('#employee-modal').modal('show');
				$('#ID').val(ID);
				$('#first_name').val(data.first_name);
				$('#last_name').val(data.last_name);
				$('#email_address').val(data.email_address);
				$('#password').val(data.password);
				$('#date_of_birth').val(data.date_of_birth);
				// $('#Permission').val(data.Permission);

				$('.modal-title').html("Edit Employee");
				$('#action').val('updateEmployee');
				$('#save').val('Save');
			}
		})
	});
	
	$("#table-employee").on('click', '.delete', function(){
		var ID = $(this).attr("emp_id");		
		var action = "deleteEmployee";
		if(confirm("Are you sure you want to delete this employee?")) {
			$.ajax({
				url:'advanced-employee-action.php',
				method:"POST",
				data:{ID:ID, action:action},
				success:function() {					
					tableEmployee.ajax.reload();
				}
			})
		} else {
			return false;
		}
	});
});