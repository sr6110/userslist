import { Row, Col, Modal, Form, Input, Card } from "antd";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { usersEndpoint, avatarUrl } from "./config";
import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  HeartOutlined,
  DeleteFilled,
  HeartFilled
} from "@ant-design/icons";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

function App() {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({})
  };

  const performAPICall = async () => {
    setLoading(true);
    try {
      const res = await axios.get(usersEndpoint);
      setUsers(res.data.map(user => { return { ...user, isLiked: false } }));
    } catch (e) {
      if (e.response && e.response.status === 500) {
      } else {
        console.log(
          "Could not fetch products. Check that the backend is running , reachable and return the valid JSON "
        );
      }
    }
    setLoading(false);
  };

  const removeUser = (deletedUserId) => {
    setUsers(users.filter(u => u.id !== deletedUserId))
  }


  function updateUser(updatedObject) {
    if (updatedObject.name.length == 0) {
      return false
    } else if (updatedObject.email.length == 0) {
      return false
    } else if (updatedObject.phone.length == 0) {
      return false
    } else if (updatedObject.website.length == 0) {
      return false
    }

    setUsers(users.map((item) => {
      if (item.id !== updatedObject.id) {
        return item; 
      }
      return {
        ...item,
        ...updatedObject
      };
    }))
    setIsModalOpen(false);
  }


  const handleLiked = (user) => {
    let tempUsers = users;
    setUsers(tempUsers.map(obj => obj.id == user.id ? { ...obj, isLiked: !obj.isLiked } : { ...obj, isLiked: obj.isLiked }))
  }

  useEffect(() => {
    performAPICall();
  }, []);


  return (
    <>
      {isLoading ? <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div> :
        <Row>{users.length > 0 ? users.map((user, i) => (
          <Fragment key={user.id}>
            <Col xs={24} sm={24} md={8} lg={8} xl={6}>
              <Card
                style={{ margin: "15px" }}
                cover={
                  <div className="cardHeadImage">
                    <img
                      alt={user.name}
                      src={avatarUrl(user.username)}
                      style={{ width: "200px", height: "200px" }}
                    />
                  </div>
                }
                actions={[
                  user.isLiked ? <HeartFilled key="heart" style={{ color: "rgb(255, 0, 0)", fontSize: "20px" }} onClick={() => handleLiked(user)} /> : <HeartOutlined key="heart" style={{ color: "rgb(255, 0, 0)", fontSize: "20px" }} onClick={() => handleLiked(user)} />,
                  <EditOutlined key="edit" style={{ fontSize: "18px" }}
                    onClick={() => { setFormData(user); showModal(); }} />,
                  <DeleteFilled key="delete" style={{ fontSize: "18px" }} onClick={() => removeUser(user.id)} />,
                ]}
              >
                <h3 className="user-title">{user.name}</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <MailOutlined style={{ fontSize: "18px" }} />
                  <p style={{ marginLeft: "10px" }}>{user.email}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <PhoneOutlined style={{ fontSize: "18px" }} />
                  <p style={{ marginLeft: "10px" }}>{user.phone}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <GlobalOutlined style={{ fontSize: "18px" }} />
                  <p style={{ marginLeft: "10px" }}>{user.website}</p>
                </div>
              </Card>
            </Col>

          </Fragment>
        )) : <div style={{ margin: "0 auto" }}><span>No users</span></div>}</Row>}

      <Modal title="Basic Modal" open={isModalOpen} onCancel={handleCancel} onOk={() => updateUser(formData)}>
        <Form form={form}  {...formItemLayout}>
          <Form.Item label="Name" rules={[{ type: 'string', required: true, message: 'Name is required' }]} required>
            <Input value={formData.name} onChange={e => { setFormData({ ...formData, name: e.target.value }); }} required
              className={formData.name != undefined && formData.name.length == 0 ? 'borderHoverWrong' : 'borderHoverRight'} />
            {formData.name != undefined && formData.name.length == 0 && <span style={{ color: '#f5222d' }}>Name is required</span>}
          </Form.Item>
          <Form.Item label="Email" rules={[{
            type: 'email', required: true, message: 'Email is required', types: {
              email: 'Invalid email',
            }
          }]} required>
            <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={formData.email != undefined && formData.email.length == 0 ? 'borderHoverWrong' : 'borderHoverRight'} />
            {formData.email != undefined && formData.email.length == 0 && <span style={{ color: '#f5222d' }}>Email is required</span>}
          </Form.Item>
          <Form.Item label="Phone" required rules={[{ type: 'string', required: true, message: 'Phone is required' }]}>
            <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className={formData.phone != undefined && formData.phone.length == 0 ? 'borderHoverWrong' : 'borderHoverRight'} />
            {formData.phone != undefined && formData.phone.length == 0 && <span style={{ color: '#f5222d' }}>Phone is required</span>}
          </Form.Item>
          <Form.Item label="Website" required rules={[{ type: 'string', required: true, message: 'Website is required' }]}>
            <Input value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })}
              className={formData.website != undefined && formData.website.length == 0 ? 'borderHoverWrong' : 'borderHoverRight'} />
            {formData.website != undefined && formData.website.length == 0 && <span style={{ color: '#f5222d' }}>Website is required</span>}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default App;
