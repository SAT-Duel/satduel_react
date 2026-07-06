import React, {useState, useEffect, useCallback} from 'react';
import {Plus, Search} from 'lucide-react';
import {useAuth} from '../../context/AuthContext';
import axios from 'axios';
import ClassCard from '../../components/Classes/ClassCard';
import JoinClassModal from '../../components/Classes/JoinClassModal';
import CreateClassModal from '../../components/Classes/CreateClassModal';
import {Button, Card, PageContainer, Spinner} from '../../components/ui';
import {notify} from '../../utils/notify';

const ClassListPage = () => {
    const {user, token} = useAuth();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [classCode, setClassCode] = useState('');
    const [newClassName, setNewClassName] = useState('');
    const [newClassDescription, setNewClassDescription] = useState('');

    const fetchClasses = useCallback(async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/classes/`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setClasses(response.data);
        } catch (error) {
            notify.error('Failed to fetch classes');
        } finally {
            setLoading(false);
        }
    }, [token]);
    
    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    const handleJoinClass = async () => {
        if (!classCode.trim()) {
            notify.warning('Enter a class code first.');
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/classes/join/`,
                {code: classCode},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            notify.success('Successfully joined class!');
            setShowJoinModal(false);
            setClassCode('');
            fetchClasses();
        } catch (error) {
            notify.error(error.response?.data?.detail || 'Failed to join class');
        }
    };

    const handleCreateClass = async () => {
        if (!newClassName.trim()) {
            notify.warning('Class name is required.');
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/classes/`,
                {name: newClassName, description: newClassDescription},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            notify.success('Class created successfully!');
            setShowCreateModal(false);
            setNewClassName('');
            setNewClassDescription('');
            fetchClasses();
        } catch (error) {
            notify.error(error.response?.data?.detail || 'Failed to create class');
        }
    };

    return (
        <PageContainer className="min-h-screen py-6 sm:py-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-700">
                        Class Hub
                    </div>
                    <h1 className="text-3xl font-black text-slate-950">My Classes</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Join a teacher group or manage the classes you created.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    {user?.role === 'TEACHER' && (
                        <Button onClick={() => setShowCreateModal(true)}>
                            <Plus size={18}/> New Class
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => setShowJoinModal(true)}>
                        <Search size={18}/> Join Class
                    </Button>
                </div>
            </div>

            {loading ? (
                <Card className="flex min-h-72 items-center justify-center">
                    <Spinner/>
                </Card>
            ) : classes.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {classes.map(cls => (
                        <ClassCard key={cls.id} cls={cls}/>
                    ))}
                </div>
            ) : (
                <Card className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-400">
                        <Search size={24}/>
                    </div>
                    <h2 className="text-xl font-black text-slate-900">No classes yet</h2>
                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Enter a class code from your teacher, or create a class if you are using SAT Duel with students.
                    </p>
                </Card>
            )}

            <JoinClassModal
                visible={showJoinModal}
                onCancel={() => setShowJoinModal(false)}
                onOk={handleJoinClass}
                classCode={classCode}
                setClassCode={setClassCode}
            />

            {user?.role === 'TEACHER' && (
                <CreateClassModal
                    visible={showCreateModal}
                    onCancel={() => setShowCreateModal(false)}
                    onCreate={handleCreateClass}
                    className={newClassName}
                    setClassName={setNewClassName}
                    classDescription={newClassDescription}
                    setClassDescription={setNewClassDescription}
                />
            )}
        </PageContainer>
    );
};

export default ClassListPage;
