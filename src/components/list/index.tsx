// import { Avatar, List } from 'antd';
// import request from '../../server';
// import { useQuery } from 'react-query';
// import ItemType from '../../types/item';


// const CollectionList = ({ collectionId }: { collectionId: string | undefined }) => {

//   const getCollectionItems = async () => {
//     if (collectionId) {
//       const { data } = await request.get(`collections/${collectionId}`);
//       return data;
//     }
//   }

//   const { data: items } = useQuery("collectionItems", getCollectionItems);


//   return (
//     <List
//       itemLayout="vertical"
//       size="large"
//       pagination={{
//       }}
//       dataSource={items}
//       renderItem={(item: ItemType) => (
//         <List.Item
//           key={item?._id}
//           actions={[
//           ]}
//           extra={
//             <img
//               width={272}
//               alt="logo"
//               src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
//             />
//           }
//         >
//           <List.Item.Meta
//             avatar={<Avatar />}
//             title={<a>{item?.name}</a>}
//             description={item.description}
//           />
//           {item.content}
//         </List.Item>
//       )}
//     />
//   )
// };

// export default CollectionList;