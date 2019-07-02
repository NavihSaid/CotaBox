<template>
<div>
    <div class="navbar navbar-default flipkart-navbar">
        <div class="container">
            <div class="navbar-header">
                <button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#"></a>
            </div>
            

            <div class="row navbar-collapse collapse" id="navbar-main">

                    <form class="navbar-form" id="add_participation" role="search" @submit.prevent="addTask">
                        <div class="form-group">
                            <input type="text" class="form-control flipkart-navbar-input"  placeholder="First Name" v-model="task.first_name" required oninvalid="this.setCustomValidity('Please fill out this field.');">
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control flipkart-navbar-input" placeholder="Last Name" v-model="task.last_name" required oninvalid="this.setCustomValidity('Please fill out this field.')">
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control flipkart-navbar-input" placeholder="Participation" autocomplete="off" v-model="task.participation" required oninvalid="this.setCustomValidity('Please fill out this field.')" onkeypress="return event.charCode >= 48 && event.charCode <= 57" max="100">
                        </div>
                        <button class="btn flipkart-navbar-button">SEND</button>
                    </form>
                    <a class="navbar-brand" href="#"></a>
            </div>
        </div>
    </div>
    <div class="container">
        <div>
            <center>
                <h1>DATA</h1>
                <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h5>
            </center>
        </div>
        <div class="col-md-6 mainBody">
            <table class="table table-bordered table-striped">
                <thead class="thead-dark">
                  <tr>
                    <!--<th scope="col">#</th>-->
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Participation</th>
                    <th scope="col">Options</th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="task of tasks" v-bind:key="task.id">
                        <td>{{task.first_name}}</td>
                        <td>{{task.last_name}}</td>
                        <td>{{task.participation}} %</td>
                        <td>
                            <button class="btn btn-danger" @click="deleteTask(task._id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col-md-6 mainBody">
            <canvas id="pieChart"></canvas>
        </div>
    </div>

</div>
</template>
<script>    

    $(function() {
        
        //chart
        const pieChart = document.getElementById('pieChart');
        const ctx = pieChart.getContext("2d");
        

    });

    // var to generate charts
    var xlabels = [];
    var xdatas = [];

    // var to block participation bigger than 100%
    var xparticipation = [];

    class Task {
        constructor(first_name, last_name, participation){
            this.first_name = first_name;
            this.last_name = last_name;
            this.participation = participation;
        }
    }

    export default {
        data() {
            return {
                task: new Task(),
                tasks: []
            }
        },
        created() {
            this.getTasks();
        },       
        methods: {
            
            addTask() {

                fetch('/api/tasks')
                    .then(res => res.json())
                    .then(data => {

                        this.tasks = data;

                        var i = 0;

                        try {
                           while (this.tasks[i].first_name){
                                // validation of 100% of participation
                                xparticipation = Number(xparticipation) + Number(this.tasks[i].participation);
                                i++;
                            }
                         }
                         catch (e) {
                            
                         }
                        
                         if(xparticipation == 100 || xparticipation > 100){

                            // mensage of limit participation
                            var erro = '{"erro": "Maximum share reached!"}';
                            var msg = JSON.parse(erro);

                            alert("Erro: " + msg.erro);

                            // validation of 100% of participation
                            xparticipation = 0;
                            
                            
                         } else if(xparticipation < 100) {

                            var var_real = document.getElementById('participation').value;
                            
                            if (Number(var_real) + Number(xparticipation) > 100){

                                // mensage of limit participation
                                var erro = '{"erro": "Value will exceed maximum stake!"}';
                                var msg = JSON.parse(erro);

                                alert("Erro: " + msg.erro);

                                // validation of 100% of participation
                                xparticipation = 0;

                            } else {

                                //add task
                                fetch('/api/tasks', {
                                    method: 'POST',
                                    body: JSON.stringify(this.task),
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-type': 'application/json'    
                                    }
                                })
                                .then(res => res.json())
                                .then(data => {
                                   this.getTasks();
                                })

                                this.task = new Task();

                                // validation of 100% of participation
                                xparticipation = 0;
                            }
                         };
                    });

            },
            getTasks(){
                fetch('/api/tasks')
                    .then(res => res.json())
                    .then(data => {
                        this.tasks = data;

                        var i = 0;

                        // full var to chart
                        try {
                           while (this.tasks[i].first_name){
                                xlabels.push(this.tasks[i].first_name+" "+this.tasks[i].last_name);
                                xdatas.push(this.tasks[i].participation);
                                i++;
                            }
                         }
                         catch (e) {
                            
                         }
                        
                         this.generateChart(xlabels, xdatas);   
                    });
                          
            },
            deleteTask(id) {
                fetch('/api/tasks/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'    
                    } 
                })
                .then(res => res.json())
                .then(data => {
                    this.getTasks();
                })
            }, 
            generateChart(labels, datas){
		new Chart(pieChart, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Participaion',
                            data: datas,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ]
                            
                        }]
                    },
                    options: {
                        legend: {
                            position: 'right',
			},
                    }
                });
                
                xlabels = [];
                xdatas = [];
            },
            limpaForm () {
                for (field in this.fields) this.fields[field] = ""
              }

        }
    }

</script>