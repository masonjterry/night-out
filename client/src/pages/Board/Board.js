import React from "react";
import DeleteBtn from "../../components/DeleteBtn";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { List, ListItem } from "../../components/List";

const style = {
  margin: 20,
  buttonStyle: {
    backgroundColor: "#607D8B",
    marginBottom: 10
  },
  favBtn: {
    backgroundColor: "#ddd",
    color: "#F06292",
    marginLeft: 10
  },
  divStyle: {
    backgroundColor: "#607D8B",
    color: "#fff",
    float: "left",
    paddingTop: 5,
    paddingBottom: 5,
    margin: 10,
    borderRadius: 10,
    boxShadow: "2px 2px #ccc"
  },
  headStyle: {
    color: "#fff",
    margin: 10,
    textTransform: "none"
  },
  elementStyle: {
    margin: 10
  },
  inputStyle: {
    margin: 15
  },
  subBtn: {
    margin: 10,
    backgroundColor: "#607D8B"
  },
  modal: {
    overlay: {
      backgroundColor: "rgba(150, 150, 150, .8)"
    },
    content : {
      borderRadius: "15px"
  }
}
}

export default class Board extends React.Component {

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  openModal = () => {
    this.setState({
      activityName: "",
      activityDescription: "",
      activityTime: "",
      location: "",
      link: "",
      modalIsOpen: true
    });
  };

  handleClick = (e) => {
    e.preventDefault();
    this.setState({ modalIsOpen: false });
  };

    state = {
    activities: [],
    activityName: "",
    activityDescription: "",
    activityTime: "",
    location: "",
    link: "",
    notes: "",
    votes: "",
    nightID: "",
    modalIsOpen: false
    };

    componentDidMount = () => {
      const token=localStorage.getItem("token");
      const email=localStorage.getItem("email");
      const name=localStorage.getItem("name");
      const nightCode = localStorage.getItem("nightID")||"";
      if (nightCode && token) {
        this.loadNight(nightCode);
      }
      this.setState({
        nightID: nightCode,
        email: email,
        name: name
      });
    };

  loadNight = (nightID) => {
    API.getNight(nightID)
    .then(res => {
      // const orderedActivities = res.data
      this.setState({ activities: res.data });
    })
    .catch(err => {
      console.log(err);
      alert("try logging in again\n"+ err);
    });
  }

  deleteActivity = id => {
    API.deleteActivity(id)
      .then(res => this.loadNight(this.state.nightID))
      .catch(err => console.log(err));
  }

  upvoteActivity = (id , votes, lovers) => {
    API.updateActivity(id,{
      // votes: votes+1,
      $addToSet: {lovers: this.state.name}
    })
      .then(res => this.loadNight(this.state.nightID))
      .catch(err => console.log(err));
  }


  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.loadNight(this.state.nightID);
    localStorage.setItem("nightID", this.state.nightID);
  }

  handleFormSubmit = e => {
    e.preventDefault();
    if (this.state.activityName && this.state.activityDescription) {
      API.saveActivity({
        activityName: this.state.activityName,
        activityDescription: this.state.activityDescription,
        activityTime: this.state.activityTime,
        location: this.state.location,
        link: this.state.link,
        notes: this.state.notes,
        votes: this.state.votes,
        nightID: this.state.nightID
      })
        .then(res => this.loadNight(this.state.nightID))
        .catch(err => console.log(err));
        this.setState({ modalIsOpen: false });
    }
  };

  render() {
    return (
      <div style={style}>
        <h1>{localStorage.getItem("nightID")|| "New Night"}</h1>
        <hr />

        {/* Button to add to board */}
        <button onClick={this.openModal} style={style.buttonStyle} className="mdc-fab material-icons">
          <span className="mdc-fab__icon">add</span>
        </button>

        {/* input for night id */}
        <div className="mdc-text-field">
          <input style={style.inputStyle} name="nightID" className="mdc-text-field__input" onChange={this.handleChange} value={this.state.nightID} placeholder="Night Code" />
        </div>
        <button style={style.subBtn} onClick={this.handleSearch} className="mdc-button mdc-button--raised">Submit</button>

        {/* modal for adding to the board */}
        <Modal isOpen={this.state.modalIsOpen} ariaHideApp={false} style={style.modal}>
          <button onClick={this.closeModal}>X</button>
          <h1>Add To Your Board</h1>
          <form>
            <div className="mdc-text-field">
              <input name="activityName" className="mdc-text-field__input" onChange={this.handleChange} value={this.state.activityName} placeholder="activityName" />
            </div><br />
            <div className="mdc-text-field">
              <input name="activityDescription" className="mdc-text-field__input" onChange={this.handleChange} value={this.state.activityDescription} placeholder="activityDescription" />
            </div><br />
            <div className="mdc-text-field">
              <input name="activityTime" className="mdc-text-field__input" onChange={this.handleChange} value={this.state.activityTime} placeholder="activityTime" />
            </div><br />
            <div className="mdc-text-field">
              <input name="location" className="mdc-text-field__input" onChange={this.handleChange} value={this.state.location} placeholder="location" />
            </div><br />
            <div className="mdc-text-field">
              <input name="link" className="mdc-text-field__input" onChange={this.handleChange} value={this.state.link} placeholder="link" />
            </div><br />
            <div className="mdc-text-field">
              <input name="nightID" className="mdc-text-field__input" onChange={this.handleChange} value={this.state.nightID} placeholder="nightID" />
            </div><br />

            <button onClick={this.handleFormSubmit} style={style.buttonStyle} className="mdc-button mdc-button--raised">Submit</button>
          </form>
        </Modal>

        {/* Board items dispaly */}
        <div>
        {this.state.activities.length ? (
              <div>
                <List>
                    {this.state.activities.map(activity => (
                      <div style={style.divStyle} key={activity._id}>
                      <ListItem>

                          <DeleteBtn onClick={() => this.deleteActivity(activity._id)} />
                        <Link to={"/activities/" + activity._id}>
                          <h2 style={style.headStyle}>
                            {activity.activityName}
                          </h2>
                          </Link>
                          <button onClick={() => this.upvoteActivity(activity._id,activity.votes)} style={style.favBtn} className="mdc-fab mdc-fab--mini material-icons" aria-label="Favorite">
                            <span className="mdc-fab__icon">
                              favorite
                            </span>
                          </button>

                        <p style={style.elementStyle}><strong>Votes: </strong>{activity.lovers.length}</p>
                        <p style={style.elementStyle}><strong>Lovers: </strong>{activity.lovers.map( lover => (lover+" "))}</p>
                        <p style={style.elementStyle}><strong>Description: </strong>{activity.activityDescription}</p>
                        <p style={style.elementStyle}><strong>Time: </strong>{activity.activityTime}</p>
                        <p style={style.elementStyle}><strong>Location: </strong>{activity.location}</p>
                        <p style={style.elementStyle}><strong>Link: </strong>{activity.link}</p>
                        <p style={style.elementStyle}><strong>Notes: </strong>{activity.notes}</p>
                        <p style={style.elementStyle}><strong>Night Code: </strong>{activity.nightID}</p>
                      </ListItem>
                      </div>
                    ))}
                </List>
              </div>
            ) : (<div>
              <h3>Nothing planned on this night... <em>yet!</em></h3> <p> Enter an existing night code or enter a new one to start planning!</p>
              </div>
            )}
        </div>
      </div>
    );
  }
}
