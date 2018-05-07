import React, { Component } from 'react';
import AssignmentCard from './AssignmentCard';

import { Container, Row, Card, CardTitle, CardImg } from 'reactstrap';
import { Link } from 'react-router-dom';

class AssignmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: [
        {
          id: 1,
          assignmentName: 'Mary Had A Little Lamb',
          daysToPractice: ['Monday', 'Tuesday', 'Friday'],
          hoursToPractice: 2,
          dueDate: '05/05/18',
          musicFile: 'MusicSheet Goes Here',
          email: 'playingpiano@gmail.com',
          clientName: 'Ralph Waldo Emerson',
          teacherName: 'Sally Fields',
        },
        {
          id: 2,
          assignmentName: 'Boom Donkey',
          daysToPractice: ['Monday', 'Tuesday', 'Friday'],
          hoursToPractice: 2,
          dueDate: '05/05/18',
          musicFile: 'MusicSheet Goes Here',
          email: 'playingpiano@gmail.com',
          clientName: 'Ralph Waldo Emerson',
          teacherName: 'Sally Fields',
        },
      ],
    };
  }

	addAssignment = (assignment) => {
	  // This takes info form the form and adds it to the state
	  // That is then passed down to AssignmentList
	  this.setState({
	    assignments: [...this.state.assignments, assignment],
	  });
	};

	deleteAssignment = (id) => {
	  const filteredAssignments = this.state.assignments.filter(a => a.id !== id);
	  this.setState({
	    assignments: filteredAssignments,
	  });
	};

	render() {
	  return (
  <div>
    <Container>
      <Row>
        {this.state.assignments.map((assignment, key) => (
          <div key={key}>
            <AssignmentCard
              deleteAssignment={this.deleteAssignment}
              id={assignment.id}
              match={this.props.match}
              name={assignment.assignmentName}
              dueDate={assignment.dueDate}
              client={assignment.clientName}
              email={assignment.email}
              days={assignment.daysToPractice}
              hours={assignment.hoursToPractice}
              file={assignment.musicFile}
            />
          </div>
							))}

        <Link to="/dashboard/add-assignment">
          <Card>
            {/* long image url / couldnt' get it to load */}
            <CardImg
              width="20%"
              src="data:image/png;base64,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"
            />
            <CardTitle>Add Assignment</CardTitle>
          </Card>
        </Link>
      </Row>
    </Container>
  </div>
	  );
	}
}

export default AssignmentList;
