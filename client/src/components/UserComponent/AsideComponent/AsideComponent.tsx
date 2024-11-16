import { useEffect, useState } from 'react';
import './AsideComponent.css';
import Navbar from '../../AdminComponent/UsableComponents/Navbar/Navbar';
import Table from '../../AdminComponent/Table/UserTable';

const Aside: React.FC = () => {
    const [activeSideBar, setActiveSideBar] = useState<string>('Dashboard');
    const [email, setEmail] = useState<string>('');
    const [tableData,setTableData] = useState<{columns : any[] , data : any[]}>({
        columns : [],
        data : []
    })

    const handleActiveTab = (sideBar: string) => {
        setActiveSideBar(sideBar);
        loadTableData(sideBar)
    };

    const loadTableData = (sideBar:string) =>{

        let columns : any[] = [];
        let data : any[] = [];

        switch (sideBar) {
            case 'Users':
              columns = [
                { header: 'SL NO', accessor: 'id' },
                { header: 'EMAIL', accessor: 'email' },
                { header: 'STATUS', accessor: 'status' },
                { header: 'ACTION', accessor: 'action' }
              ];
              data = [
                { id: 1, email: 'Mark@gmail.com', status: 'ACTIVE', action: 'BLOCK' },
                { id: 2, email: 'Mark@gmail.com', status: 'ACTIVE', action: 'BLOCK' },
                { id: 3, email: 'Mark@gmail.com', status: 'ACTIVE', action: 'BLOCK' },
              ];
              break;
            case 'Theatres':
              columns = [
                { header: 'ID', accessor: 'id' },
                { header: 'NAME', accessor: 'name' },
                { header: 'LOCATION', accessor: 'location' },
                { header: 'TOTAL SCREENS', accessor: 'screens' },
                { header: 'STATE', accessor: 'state' },
                { header: 'CITY', accessor: 'city' },
                { header: 'ACTION', accessor: 'action' },

              ];
              data = [
                { id: 1, name: 'Cineplex', location: 'Trivandrum', screens : '4', state:'Kerala', city :'Trivandrum', action :'BLOCK' },
                { id: 2, name: 'Cineplex', location: 'Trivandrum', screens : '4', state:'Kerala', city :'Trivandrum', action : 'UNBLOCK' },
              ];
              break;
              case 'Movies':
              columns = [
                { header: 'ID', accessor: 'id' },
                { header: 'NAME', accessor: 'name' },
                { header: 'DURATION', accessor: 'duration' },
                { header: 'RELEASE DATE', accessor: 'date' },
                { header: 'LANGUAGES', accessor: 'languages' },
                { header: 'CERTIFICATE', accessor: 'certificate' },
                { header: 'ACTION', accessor: 'action' },

              ];
              data = [
                { id: 1, name: 'AMARAN', duration: '169', date : '13-10-2024', languages:'Tamil', certificate :'u/a', action :'BLOCK' },
                { id: 1, name: 'AMARAN', duration: '169', date : '13-10-2024', languages:'Tamil', certificate :'u/a', action :'BLOCK' },
              ];
              break;
              case 'Shows':
                columns = [
                  { header: 'ID', accessor: 'id' },
                  { header: 'THEATRE NAME', accessor: 'name' },
                  { header: 'SEATING CAPACITY', accessor: 'capacity' },
                  { header: 'SEAT PRICE', accessor: 'price' },
                  { header: 'QUALITY', accessor: 'quality' },
                  { header: 'SHOW TIMES', accessor: 'showtimes' },
                  {header: 'SHOW DATES',accessor : 'showdates'},
                  { header: 'ACTION', accessor: 'action' },
                ];
                data = [
                  { id: 1, name: 'ARIES PLEX', capacity : '250', price:'130', quality :'4K',showtimes:'11 AM, 2 PM, 6 PM, 9 PM', showdates:'15-11-2024 -- 25-11-2024', action :'BLOCK' },
                  { id: 1, name: 'ARIES PLEX', capacity : '250', price:'130', quality :'4K',showtimes:'11 AM, 2 PM, 6 PM, 9 PM', showdates:'15-11-2024 -- 25-11-2024', action :'BLOCK' },
                ];
                break;
            // Add more cases for other sidebar items
            default:
              columns = [];
              data = [];
          }
      
          setTableData({ columns, data });
        };
    

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    return (
        <div>
            <aside>
                <header>
                    <div>
                        <p>Welcome, {email}</p>
                    </div>
                </header>
                <nav className="sideNavigation">
                    <ul>
                        <li className={activeSideBar === 'Dashboard' ? 'active' : ''}>
                            <span onClick={() => handleActiveTab('Dashboard')}><i className="fa fa-dashboard"></i>Dashboard</span>
                        </li>
                        <li className={activeSideBar === 'Users' ? 'active' : ''}>
                            <span onClick={() => handleActiveTab('Users')}><i className="fa fa-ship"></i>Users</span>
                        </li>
                        <li className={activeSideBar === 'Theatres' ? 'active' : ''}>
                            <span onClick={() => handleActiveTab('Theatres')}><i className="fa fa-users"></i>Theatres</span>
                        </li>
                        <li className={activeSideBar === 'Movies' ? 'active' : ''}>
                            <span onClick={() => handleActiveTab('Movies')}><i className="fa fa-comments"></i>Movies</span>
                        </li>
                        <li className={activeSideBar === 'Screens' ? 'active' : ''}>
                            <span onClick={() => handleActiveTab('Shows')}><i className="fa fa-area-chart"></i>Shows</span>
                        </li>
                        <li className={activeSideBar === 'Log Out' ? 'active' : ''}>
                            <span onClick={() => handleActiveTab('Log Out')}><i className="fa fa-sign-out"></i>Log Out</span>
                        </li>
                    </ul>
                </nav>
            </aside>
        <div style={{marginLeft:'220px'}}>
        <Navbar />
    </div>
    <div style={{ marginLeft: 340, marginTop:30 }}>
        {tableData.columns.length > 0 && <Table columns={tableData.columns} data={tableData.data} role = {activeSideBar} />}
      </div>
        </div>
    );
};

export default Aside;
