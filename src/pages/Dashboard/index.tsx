import { useState, useEffect } from 'react';

import api from '../../services/api';
import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface IFood {
  id: number
  name: string
  description: string
  price: string
  available: boolean
  image: string
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFood[]>([])
  const [editingFood, setEditingFood] = useState<IFood | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const handleAddFood = async (food: IFood) => {

    try {
      const response = await api.post<IFood>('/foods', {
        ...food,
        available: true,
      });

      setFoods([
        ...foods,
        response.data
      ])

    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: IFood) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood?.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered)
  }

  const toggleModal = () => setModalOpen(!modalOpen)

  const toggleEditModal = () => setEditModalOpen(!editModalOpen)

  const handleEditFood = (food: IFood) => {
    setEditModalOpen(true)
    setEditingFood(food)
  }

  useEffect(() => {

    const loadFoods = async () => {
      const response = await api.get('/foods');

      setFoods(response.data)
    }

    loadFoods()
  }, [])

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood!}
        handleUpdateFood={handleUpdateFood}
      />


      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <>
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            </>
          ))}
      </FoodsContainer>
    </>
  );
}

export { Dashboard };
