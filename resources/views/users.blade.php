<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>所有用户</title>
    <link rel="stylesheet" href="lib/normalize-css/normalize.css">
    <link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">
	<style type="text/css" media="screen">
		table.table{
			width: 80%;
	    	text-align: center;
	    	margin: 20px auto;
		}

		table img{
			width: 50px;
		}

		.pagination li{
			display: inline-block;
    		width: 30px;
   		}	
   		.pagination li a{
   			text-decoration: none;
   		}	

   		.table th{
   			text-align: center;
   		}    
	</style>
</head>
<body>
	 <table class="table">
	 	<thead>
	 		<tr>
	 			<th></th>
	 			<th>姓名</th>
	 			<th>电话</th>
	 			<th>昵称</th>
	 			<th>分数</th>
	 		</tr>
	 	</thead>
	 	<tbody>
	 	@foreach ($users as $user)
	 		<tr>
	 			<td>
	 				<img src="{{$user->open->headimgurl}}" alt="">
	 			</td>
	 			<td>{{$user->name}}</td>
	 			<td>{{$user->mobile}}</td>
	 			<td>{{$user->open->nickname}}</td>
	 			<td>{{$user->score}}</td>
	 		</tr>
	 	@endforeach
	 	</tbody>
	 </table>
	<div style="text-align: center">
	 {!! $users->links() !!}
			
	</div>
</body>
</html>