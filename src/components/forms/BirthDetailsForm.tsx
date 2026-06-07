import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const birthDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
  birthTime: z.string().optional(),
  birthPlace: z.string().optional(),
});

type BirthDetailsFormData = z.infer<typeof birthDetailsSchema>;

interface BirthDetailsFormProps {
  defaultValues?: Partial<BirthDetailsFormData>;
  onSubmit: (data: BirthDetailsFormData) => void;
  showName?: boolean;
}

export function BirthDetailsForm({
  defaultValues,
  onSubmit,
  showName = false,
}: BirthDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BirthDetailsFormData>({
    resolver: zodResolver(birthDetailsSchema),
    defaultValues: {
      name: '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {showName && (
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="e.g. Priyan Sharma"
            {...register('name')}
            className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>
      )}

      <div>
        <Label htmlFor="birthDate">Birth Date</Label>
        <Input
          id="birthDate"
          type="date"
          {...register('birthDate')}
          className={errors.birthDate ? 'border-red-500 focus:border-red-500' : ''}
        />
        {errors.birthDate && (
          <p className="text-xs text-red-500 mt-1">{errors.birthDate.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="birthTime">Birth Time (optional)</Label>
          <Input id="birthTime" type="time" {...register('birthTime')} />
        </div>

        <div>
          <Label htmlFor="birthPlace">Birth Place (optional)</Label>
          <Input id="birthPlace" placeholder="e.g. Mumbai, India" {...register('birthPlace')} />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
