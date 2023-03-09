import { useEffect, useState } from 'react';
import { TextField, Button, DialogActions, Stack } from '@mui/material';
import { Scheduler } from './components/Calender/Scheduler';
import { FaCheck } from 'react-icons/fa';
// https://codesandbox.io/s/resources-7wlcy
import pl from 'date-fns/locale/pl';
import styled from 'styled-components';
import { DesktopDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ConstructionOutlined } from '@mui/icons-material';
import moment from 'moment';
import axios from 'axios';
import { ProcessedEvent } from './components/Calender/types';

const ColorPicker = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const labelsClasses = ['indigo', 'gray', 'green', 'blue', 'red', 'purple'];

export const EVENTS = [
  {
    event_id: 1,
    title: 'Event 1',
    start: new Date('2023 3 9 09:30'),
    end: new Date('2023 3 9 10:30'),
    admin_id: 1,
  },
  {
    event_id: 2,
    title: 'Event 2',
    start: new Date('2021 5 4 10:00'),
    end: new Date('2021 5 4 11:00'),
    admin_id: 2,
  },
];

interface CustomEditorProps {
  scheduler: any;
  setEvents: (data: any) => void;
}
const CustomEditor = ({ scheduler, setEvents }: CustomEditorProps) => {
  const event = scheduler.edited;

  // Make your own form/state
  const [state, setState] = useState({
    title: event?.title || '',
    description: event?.description || '',
  });
  const [error, setError] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(event?.lblClass || '');
  // const [start, setStart] = useState<Date | null>(scheduler.state.start.value,);
  // const [end, setEnd] = useState<Date | null>(scheduler.state.end.value,);

  const fetchEvent = async (data: any) => {
    await axios.post('http://localhost:5000/api/calendar', data);
  };
  const getEvent = async () => {
    const { data } = await axios.get('http://localhost:5000/api/calendar');
    setEvents(data);
  };
  const updateEvent = async (data: any) => {
    await axios.put('http://localhost:5000/api/calendar', data);
  };
  const handleChange = (value: string, name: string) => {
    setState(prev => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleSubmit = async () => {
    // Your own validation
    if (state.title.length < 3) {
      // @ts-ignore
      return setError({ ...error, title: 'Min 3 letters' });
    }

    try {
      const added_updated_event = (await new Promise(res => {
        if (event) {
          const data = {
            event_id: event?.event_id,
            title: state.title,
            start: scheduler.state.start.value,
            end: scheduler.state.end.value,
            description: state.description,
            lblClass: selectedLabel,
          };
          updateEvent(data);
          getEvent();
          scheduler.close();
        } else {
          const data = {
            event_id: event?.event_id || null,
            title: state.title,
            start: scheduler.state.start.value,
            end: scheduler.state.end.value,
            description: state.description,
            lblClass: selectedLabel,
          };

          fetchEvent(data);
          getEvent();
          scheduler.close();
        }
      })) as ProcessedEvent;

      scheduler.onConfirm(added_updated_event, event ? 'edit' : 'create');
    } finally {
      scheduler.loading(false);
    }
  };

  return (
    <div>
      <div style={{ padding: '1rem' }}>
        {/* <p>Load your custom form/fields</p> */}
        <Stack mb={'10px'}>
          <TextField
            label="Title"
            value={state.title}
            onChange={e => handleChange(e.target.value, 'title')}
            error={!!error}
            helperText={!!error && error['title']}
            fullWidth
          />
        </Stack>
        <Stack>
          <TextField
            label="Description"
            value={state.description}
            onChange={e => handleChange(e.target.value, 'description')}
            fullWidth
          />
        </Stack>
        {/* <Stack flexDirection={'row'} gap={10} mt={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="DateTimePicker"
                  value={start}
                  onChange={(newValue) => {
                    setStart(newValue);
                  }}
                />
                <DesktopDateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="DateTimePicker"
                  value={end}
                  onChange={(newValue) => {
                    setEnd(newValue);
                  }}
                />
                
            </LocalizationProvider>
        </Stack> */}

        <Stack flexDirection={'row'} gap={2} justifyContent="center" alignItems="center" mt="10px">
          {labelsClasses.map((lblClass, i) => (
            <ColorPicker
              key={i}
              onClick={() => setSelectedLabel(lblClass)}
              style={{ backgroundColor: `${lblClass}` }}>
              {selectedLabel === lblClass && (
                <span className="material-icons-outlined text-white text-sm">
                  <FaCheck color="white" />
                </span>
              )}
            </ColorPicker>
          ))}
        </Stack>
      </div>
      <DialogActions>
        <Button onClick={scheduler.close}>Anuluj</Button>
        <Button onClick={handleSubmit}>Wybierz</Button>
      </DialogActions>
    </div>
  );
};

const Container = styled.div`
  width: 100%;
  /* max-width: 1240px; */

  height: 100vh;
  margin: 0 auto;
  padding: 0 2rem;
  background-color: var(--colors-bg);
`;

function App() {
  const [events, setEvents] = useState<any | []>([]);
  const [newEvents, setNewEvents] = useState();
  const getEvent = async () => {
    const { data } = await axios.get('http://localhost:5000/api/calendar');
    setEvents(data);
  };
  const filterdata = () => {
    const newArr = events.map((object: any) => {
      return { ...object, start: new Date(object.start), end: new Date(object.end) };
    });
    setNewEvents(newArr);
  };
  useEffect(() => {
    getEvent();
  }, []);
  useEffect(() => {
    filterdata();
  }, [events]);

  // const handleDelete = async (deletedId:number) => {
  //   // Simulate http request: return the deleted id
  //   return new Promise((res, rej) => {
  //     setTimeout(() => {
  //       res(deletedId);
  //     }, 3000);
  //   });
  // };
  return (
    <Container>
      <Scheduler
        view="month"
        // @ts-ignore
        events={newEvents}
        // locale={pl}
        selectedDate={moment().toDate()}
        customEditor={scheduler => <CustomEditor scheduler={scheduler} setEvents={setEvents} />}
        viewerExtraComponent={(fields, event) => {
          return (
            <div>
              <p>Useful to render custom fields...</p>
              <p>Description: {event.description || 'Nothing...'}</p>
              <ColorPicker style={{ backgroundColor: `${event.lblClass}` }}>
                <span className="material-icons-outlined text-white text-sm">
                  <FaCheck color="white" />
                </span>
              </ColorPicker>
            </div>
          );
        }}
      />
    </Container>
  );
}

export default App;
