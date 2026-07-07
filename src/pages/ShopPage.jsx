import React, {useState} from 'react';
import Lottie from 'react-lottie';
import axios from 'axios';
import {Sparkles} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import pet1AnimationData from '../animations/pets/pet1.json';
import pet2AnimationData from '../animations/pets/pet2.json';
import {Button, Card, ModalShell, PageContainer} from '../components/ui';
import {notify} from '../utils/notify';

const defaultOptions = (animationData) => ({
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
});

const pets = [
    {
        id: 1,
        name: 'Gaming Cat',
        price: 25,
        description: 'Level 1 Base Perks:',
        benefits: ['Permanent 1% Coin Multiplier', 'Unlocks the ability to find gaming treasures in SAT Alcumus'],
        animationData: pet1AnimationData,
    },
    {
        id: 34,
        name: 'Bessie The Cow',
        price: 250,
        description: 'Level 1 Base Perks:',
        benefits: ['Permanent 50% Coin Multiplier', 'MILK?!'],
        animationData: pet2AnimationData,
    },
];

function Shop() {
    const [selectedPet, setSelectedPet] = useState(null);
    const {token} = useAuth();

    const handlePetBuy = async (id) => {
        try {
            const baseUrl = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${baseUrl}/api/buy_pet/`, {id}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = response.data;

            if (response.status === 200) {
                if (result.purchased) {
                    notify.success(result.message);
                } else {
                    notify.error(result.message);
                }
            } else {
                notify.error(result.error || 'Purchase failed.');
            }
        } catch (error) {
            console.error('Error purchasing pet:', error);
            notify.error('Purchase failed.');
        }
    };

    return (
        <PageContainer className="min-h-screen py-8 sm:py-10">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-black text-slate-950 sm:text-5xl">Coin Shop</h1>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                    Spend the coins you earn from practice.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pets.map((pet) => (
                    <Card key={pet.id} hover className="p-5 text-center">
                        <button type="button" onClick={() => setSelectedPet(pet)} className="w-full">
                            <div className="mx-auto mb-4 flex h-40 items-center justify-center">
                                <Lottie options={defaultOptions(pet.animationData)} height={150} width={150}/>
                            </div>
                            <h2 className="text-xl font-black text-slate-950">{pet.name}</h2>
                            <p className="mt-1 text-sm text-slate-500">{pet.description}</p>
                        </button>
                        <Button className="mt-5" onClick={() => handlePetBuy(pet.id)} block>
                            {pet.price} Coins
                        </Button>
                    </Card>
                ))}
            </div>

            <ModalShell
                open={!!selectedPet}
                title={selectedPet?.name}
                onClose={() => setSelectedPet(null)}
                footer={<Button onClick={() => setSelectedPet(null)}>OK</Button>}
            >
                {selectedPet && (
                    <>
                        <p className="mb-4 text-sm font-semibold text-slate-600">{selectedPet.description}</p>
                        <ul className="space-y-2">
                            {selectedPet.benefits.map((benefit) => (
                                <li key={benefit} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </ModalShell>
        </PageContainer>
    );
}

export default Shop;
