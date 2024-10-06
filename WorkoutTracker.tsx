"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Minus, X, Save, Trash2, BarChart2, Clock, Dumbbell, History, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const exerciseTypes = {
  Biceps: [
    { name: "Bicepscurl", suggestedReps: 12 },
    { name: "Sittende curl", suggestedReps: 12 },
    { name: "Hammercurl", suggestedReps: 12 },
    { name: "Stangcurl", suggestedReps: 12 },
  ],
  MageSkuldre: [
    { name: "Beinløft", suggestedReps: 15 },
    { name: "Sakseløft", suggestedReps: 15 },
    { name: "Situps", suggestedReps: 15 },
    { name: "Magemuskler", suggestedReps: 15 },
    { name: "Rulle", suggestedReps: 15 },
    { name: "Sittende Arnold Press", suggestedReps: 12 },
    { name: "Skulderpress med manualer", suggestedReps: 12 },
    { name: "Stangpress", suggestedReps: 12 },
    { name: "Bakover stangpress", suggestedReps: 12 },
    { name: "High Pull", suggestedReps: 12 },
    { name: "Sidehev", suggestedReps: 12 },
    { name: "Manualer press", suggestedReps: 12 },
    { name: "Stående militærpress", suggestedReps: 12 },
  ],
  SquatsRygg: [
    { name: "Knebøy", suggestedReps: 12 },
    { name: "Knebøy med manualer", suggestedReps: 12 },
    { name: "Knebøy med stang", suggestedReps: 12 },
    { name: "Tåhev", suggestedReps: 15 },
    { name: "Roing med stang", suggestedReps: 12 },
    { name: "Omvendt flyes", suggestedReps: 12 },
    { name: "Skuldertrekk med stang", suggestedReps: 12 },
    { name: "Skuldertrekk med manualer", suggestedReps: 12 },
  ],
  BrystTriceps: [
    { name: "Pushups", suggestedReps: 15 },
    { name: "Brystpress med manualer", suggestedReps: 12 },
    { name: "Flyes med manualer", suggestedReps: 12 },
    { name: "Skråbenk flyes", suggestedReps: 12 },
    { name: "Benkpress med manualer", suggestedReps: 12 },
    { name: "Triceps kickback", suggestedReps: 12 },
    { name: "Triceps press over hodet", suggestedReps: 12 },
    { name: "Triceps pushdown", suggestedReps: 12 },
  ],
};

const weightOptions = ["2.5kg", "3.5kg", "4.5kg", "5.5kg", "6.5kg", "8kg", "9kg", "10kg", "11.5kg", "13.5kg", "16kg", "18kg", "20.5kg", "22.5kg", "24kg", "30kg", "40kg", "Kroppsvekt"];

export default function WorkoutTracker() {
  const [selectedType, setSelectedType] = useState('Biceps')
  const [selectedExercise, setSelectedExercise] = useState(exerciseTypes.Biceps[0].name)
  const [repetitions, setRepetitions] = useState('')
  const [weight, setWeight] = useState(weightOptions[0])
  const [workoutLog, setWorkoutLog] = useState([])
  const [showConfirmClear, setShowConfirmClear] = useState(false)
  const [workoutHistory, setWorkoutHistory] = useState({})
  const [restTime, setRestTime] = useState(60)
  const [isResting, setIsResting] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [customExercise, setCustomExercise] = useState('')
  const [showCustomExerciseDialog, setShowCustomExerciseDialog] = useState(false)

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workoutLog')) || []
    setWorkoutLog(savedWorkouts)
    const savedHistory = JSON.parse(localStorage.getItem('workoutHistory')) || {}
    setWorkoutHistory(savedHistory)
  }, [])

  useEffect(() => {
    setSelectedExercise(exerciseTypes[selectedType][0].name)
  }, [selectedType])

  useEffect(() => {
    let interval
    if (isResting && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(time => time - 1)
      }, 1000)
    } else if (remainingTime === 0) {
      setIsResting(false)
    }
    return () => clearInterval(interval)
  }, [isResting, remainingTime])

  const handleAddExercise = () => {
    if (selectedExercise && repetitions && weight) {
      const newExercise = { type: selectedType, name: selectedExercise, repetitions, weight, id: Date.now() }
      const updatedLog = [...workoutLog, newExercise]
      setWorkoutLog(updatedLog)
      localStorage.setItem('workoutLog', JSON.stringify(updatedLog))
      setRepetitions('')
      setIsResting(true)
      setRemainingTime(restTime)
    }
  }

  const handleRemoveExercise = (id) => {
    const updatedLog = workoutLog.filter(exercise => exercise.id !== id)
    setWorkoutLog(updatedLog)
    localStorage.setItem('workoutLog', JSON.stringify(updatedLog))
  }

  const handleClearWorkout = () => {
    setWorkoutLog([])
    localStorage.removeItem('workoutLog')
    setShowConfirmClear(false)
  }

  const handleSaveWorkout = () => {
    const date = format(new Date(), 'yyyy-MM-dd')
    const updatedHistory = { ...workoutHistory, [date]: workoutLog }
    setWorkoutHistory(updatedHistory)
    localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory))
    setWorkoutLog([])
    localStorage.removeItem('workoutLog')
    alert('Treningsøkt lagret!')
  }

  const handleAddCustomExercise = () => {
    if (customExercise) {
      exerciseTypes[selectedType].push({ name: customExercise, suggestedReps: 12 })
      setSelectedExercise(customExercise)
      setCustomExercise('')
      setShowCustomExerciseDialog(false)
    }
  }

  const getProgressData = () => {
    const data = Object.entries(workoutHistory).map(([date, exercises]) => ({
      date,
      totalWeight: exercises.reduce((sum, ex) => sum + (ex.weight === 'Kroppsvekt' ? 0 : parseFloat(ex.weight)), 0),
      totalReps: exercises.reduce((sum, ex) => sum + parseInt(ex.repetitions), 0),
    }))
    return data.sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const getSuggestedReps = (exerciseName) => {
    const exercise = exerciseTypes[selectedType].find(ex => ex.name === exerciseName)
    return exercise ? exercise.suggestedReps : 12
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Treningsdagbok</CardTitle>
          <CardDescription className="text-center">Spor dine treningsøkter, overvåk fremgang og nå dine treningsmål</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="workout" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="workout"><Dumbbell className="mr-2 h-4 w-4" />Treningsøkt</TabsTrigger>
              <TabsTrigger value="history"><History className="mr-2 h-4 w-4" />Historikk</TabsTrigger>
              <TabsTrigger value="progress"><BarChart2 className="mr-2 h-4 w-4" />Fremgang</TabsTrigger>
            </TabsList>
            <TabsContent value="workout" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Velg muskelgruppe</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(exerciseTypes).map((type) => (
                    <Button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      variant={selectedType === type ? "default" : "outline"}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Legg til øvelse</h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Velg øvelse" />
                    </SelectTrigger>
                    <SelectContent>
                      {exerciseTypes[selectedType].map((exercise) => (
                        <SelectItem key={exercise.name} value={exercise.name}>
                          {exercise.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={repetitions}
                    onChange={(e) => setRepetitions(e.target.value)}
                    placeholder={`Repetisjoner (Foreslått: ${getSuggestedReps(selectedExercise)})`}
                    className="w-[200px]"
                  />
                  <Select value={weight} onValueChange={setWeight}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Velg vekt" />
                    </SelectTrigger>
                    <SelectContent>
                      {weightOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddExercise}>
                    <Plus className="mr-2 h-4 w-4" /> Legg til
                  </Button>
                  <Dialog open={showCustomExerciseDialog} onOpenChange={setShowCustomExerciseDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Egendefinert øvelse</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Legg til egendefinert øvelse</DialogTitle>
                        <DialogDescription>
                          Skriv inn navnet på din egendefinerte øvelse for den valgte muskelgruppen.
                        </DialogDescription>
                      </DialogHeader>
                      <Input
                        value={customExercise}
                        onChange={(e) => setCustomExercise(e.target.value)}
                        placeholder="Navn på egendefinert øvelse"
                      />
                      <DialogFooter>
                        <Button onClick={handleAddCustomExercise}>Legg til øvelse</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Nåværende treningsøkt</h2>
                  <div className="space-x-2">
                    <Button variant="destructive" onClick={() => setShowConfirmClear(true)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Tøm
                    </Button>
                    <Button onClick={handleSaveWorkout}>
                      <Save className="mr-2 h-4 w-4" /> Lagre
                    </Button>
                  </div>
                </div>
                <Card>
                  <CardContent className="p-6">
                    {workoutLog.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Dumbbell className="mx-auto h-12 w-12 mb-4" />
                        <p>Ingen øvelser lagt til ennå. Start din treningsøkt ved å legge til øvelser ovenfor.</p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[300px]">
                        <AnimatePresence>
                          {workoutLog.map((exercise) => (
                            <motion.div
                              key={exercise.id}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex justify-between items-center bg-secondary p-4 rounded mb-2"
                            >
                              <div>
                                <span className="font-semibold">{exercise.name}</span>
                                <span className="ml-2 text-muted-foreground">
                                  {exercise.repetitions} rep @ {exercise.weight}
                                </span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => handleRemoveExercise(exercise.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </div>

              {isResting && (
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Hviletimer</h3>
                  <div className="text-3xl font-bold mb-2">{remainingTime}s</div>
                  <Progress value={(restTime - remainingTime) / restTime * 100} />
                </div>
              )}

              <Separator />

              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-2">Hviletid</h3>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={restTime}
                    onChange={(e) => setRestTime(parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span>sekunder</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="history">
              <h2 className="text-xl font-semibold mb-4">Treningshistorikk</h2>
              {Object.keys(workoutHistory).length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <History className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                    <p>Ingen treningshistorikk ennå. Fullfør og lagre din første treningsøkt for å se den her.</p>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="h-[400px]">
                  {Object.entries(workoutHistory).map(([date, exercises]) => (
                    <Card key={date} className="mb-4">
                      <CardHeader>
                        <CardTitle>{format(new Date(date), 'd. MMMM yyyy', { locale: nb })}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {exercises.map((exercise, index) => (
                          <div key={index} className="mb-2">
                            <span className="font-semibold">{exercise.name}</span>
                            <span className="ml-2 text-muted-foreground">
                              {exercise.repetitions} rep @ {exercise.weight}
                            </span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              )}
            </TabsContent>
            <TabsContent value="progress">
              <h2 className="text-xl font-semibold mb-4">Fremgangsgraf</h2>
              {Object.keys(workoutHistory).length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <BarChart2 className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                    <p>Ingen fremgangsdata ennå. Fullfør og lagre flere treningsøkter for å se din fremgang her.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getProgressData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="totalWeight" stroke="#8884d8" name="Total vekt (kg)" />
                      <Line yAxisId="right" type="monotone" dataKey="totalReps" stroke="#82ca9d" name="Totale repetisjoner" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showConfirmClear} onOpenChange={setShowConfirmClear}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tøm treningsøkt?</DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil tømme den nåværende treningsøkten? Denne handlingen kan ikke angres.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmClear(false)}>Avbryt</Button>
            <Button variant="destructive" onClick={handleClearWorkout}>Tøm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}