import React, { Component, useEffect } from 'react'
import { 
	StyleSheet,
	Text,
	View,
	ImageBackground,
	FlatList,
	TouchableOpacity,
	Platform,


} from 'react-native'
import moment from 'moment'
import 'moment/locale/pt-br'
import hojeImage from '../assets/imgs/today.jpg'
import estiloComum from '../estiloComum'
import Task from '../components/Task'
import AddTask from './AddTask'
import Icon from '@expo/vector-icons/FontAwesome'
import AsyncStorage from '@react-native-community/async-storage'

const initialState = {
	tasks: [],
	visibleTasks:[],
	showDoneTasks:true,
	showAddTask:false
}

export default class Agenda extends Component {


	state = {
		...initialState
	}

	addTask = task => {
		const tasks = [...this.state.tasks]
		tasks.push({
			id: Math.random(),
			desc: task.desc,
			estimateAt: task.date,
			doneAt: null
		})
		this.setState({tasks, showAddTask: false}, this.filterTask)
	}

	toggleTask = id  => {
		const tasks = [...this.state.tasks]
		tasks.forEach(task => {
			if (task.id === id){
				task.doneAt = task.doneAt ? null : new Date()
			}
			
		})
		this.setState({tasks}, this.filterTask)

	}

	//ou

	// toggleTask = id  => {
	// 	const tasks = this.state.tasks.map(task => {
	// 		if (task.id === id){
	// 			task = {...task}
	// 			task.doneAt = task.doneAt ? null : new Date()
	// 		}
	// 		return task
	// 	})
	// 	this.setState({tasks})
	// }
	 
	filterTask = () => {
		let visibleTasks = null
	
		if(this.state.showDoneTasks){
		visibleTasks = [...this.state.tasks]
	} else {
		const pending = task => task.doneAt === null
		visibleTasks = this.state.tasks.filter(pending)
	}

	this.setState({ visibleTasks })
	AsyncStorage.setItem('tasksState', JSON.stringify(this.state))
	}

	toggleFilter = () => {
		this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTask)
	}

  componentDidMount = async() => {
		const stateString = await AsyncStorage.getItem('tasksState')
		const state = 	JSON.parse(stateString) ||  initialState
		this.setState(state, this.filterTask)
	}


	deleteTask = id => {
		const tasks = this.state.tasks.filter(task => task.id !== id)
		this.setState({tasks}, this.filterTask)
	}

	render(){



		return (

			<View style={styles.container}> 
			<AddTask  
			  isVisible={this.state.showAddTask}
				onSave={this.addTask}
				onCancel={() => this.setState({ showAddTask:false})}			
				/>

			<ImageBackground  source={hojeImage} style={styles.background}>
				
				<View style={styles.iconBar}>
					<TouchableOpacity onPress={this.toggleFilter}>
						<Icon 
							size={20} color={estiloComum.colors.secondary}
							name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} 
									/>
					</TouchableOpacity>
				</View>

				<View style={styles.titleBar}>
					<Text style={styles.title}>Hoje</Text>
					<Text style={styles.subtitle}>
					 {moment().locale('pt-br').format('ddd, D [de] MMMM')}
					</Text>
					
			    </View>
			 </ImageBackground>



			    <View style={styles.tasksContainer}>
					 
					 <FlatList
					  keyExtractor={item => `${item.id}`} 
					 	data={this.state.visibleTasks} 
						 renderItem={({item}) => 
						 <Task {...item} 
						 onDelete={this.deleteTask}
						 onToggleTask={this.toggleTask}/>}>

						 </FlatList>
			    </View>

		

				<TouchableOpacity  
					activeOpacity={0.7}			
					onPress={() => { this.setState({ showAddTask: true })}}
					style={styles.addButton} >
					<Icon 
						name="plus" 
						size={20} 
						color={estiloComum.colors.secondary}/>
					
				</TouchableOpacity>

			</View>
	)
  }
}

const styles = StyleSheet.create({
	container:{
			flex:1,
	},

	background:{
		flex:3,
	},

	titleBar:{
		flex:1,
		justifyContent: 'flex-end'
	},

	title:{
		// fontFamily: estiloComum.fontFamily,
		color: estiloComum.colors.secondary,
		fontSize:50,
		marginLeft: 20,
		marginBottom:10,
	},

	subtitle:{
		// fontFamily:
		color: estiloComum.colors.secondary,
		fontSize:20,
		marginLeft: 20,
		marginBottom:30,
	},
	tasksContainer:{
		 flex:7,
	},
	iconBar:{
		marginTop: Platform.OS === 'ios' ? 30 : 10,
		marginHorizontal:20,
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},

	addButton:{
		position: 'absolute',
		right: 30,
		bottom:30,
		width:50,
		height: 50,
		borderRadius: 25,
		backgroundColor:estiloComum.colors.today,
		justifyContent: 'center',
		alignItems: 'center'

	}



});
