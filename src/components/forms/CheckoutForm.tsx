import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';

function Checkbox({ id, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      id={id}
      className="w-4 h-4 text-[#C5A880] border-[#EAE6DF] rounded focus:ring-[#C5A880]"
      {...props}
    />
  );
}

const checkoutSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  size: z.enum(['standard-unisex', 'petite', 'xl-mens']),
  personalizedCertification: z.boolean().optional(),
  birthDetails: z
    .object({
      name: z.string().optional(),
      birthDate: z.string().optional(),
      birthTime: z.string().optional(),
      birthPlace: z.string().optional(),
    })
    .optional(),
  paymentMethod: z.enum(['razorpay', 'cod']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  defaultValues?: Partial<CheckoutFormData>;
  onSubmit: (data: CheckoutFormData) => void;
}

export function CheckoutForm({ defaultValues, onSubmit }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      size: 'standard-unisex',
      personalizedCertification: false,
      paymentMethod: 'razorpay',
      ...defaultValues,
    },
  });

  const isPersonalized = useWatch({ name: 'personalizedCertification' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Priyan Sharma"
            {...register('fullName')}
            className={errors.fullName ? 'border-red-500 focus:border-red-500' : ''}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="priyan@example.com"
            {...register('email')}
            className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            {...register('phone')}
            className={errors.phone ? 'border-red-500 focus:border-red-500' : ''}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Flat 123, Building Name, Street"
          {...register('address')}
          className={errors.address ? 'border-red-500 focus:border-red-500' : ''}
        />
        {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Mumbai"
              {...register('city')}
              className={errors.city ? 'border-red-500 focus:border-red-500' : ''}
            />
            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              placeholder="Maharashtra"
              {...register('state')}
              className={errors.state ? 'border-red-500 focus:border-red-500' : ''}
            />
            {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
          </div>

          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              placeholder="400001"
              {...register('pincode')}
              className={errors.pincode ? 'border-red-500 focus:border-red-500' : ''}
            />
            {errors.pincode && (
              <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[#EAE6DF] pt-6 space-y-4">
        <Label className="font-medium">Wrist Size</Label>
        <select
          {...register('size')}
          className={cn(
            'w-full bg-[#E5E3D8]/20 border border-[#D1CEBF] rounded-lg px-4 py-3 text-xs outline-none focus:border-[#A6A18F] text-[#1A1A1A] font-medium transition-colors',
            errors.size ? 'border-red-500 focus:border-red-500' : ''
          )}
        >
          <option value="standard-unisex">Standard Unisex (17cm)</option>
          <option value="petite">Petite (15cm)</option>
          <option value="xl-mens">XL Bold (19cm)</option>
        </select>
        {errors.size && <p className="text-xs text-red-500 mt-1">{errors.size.message}</p>}

        <div className="flex items-center gap-2">
          <Checkbox id="personalizedCertification" {...register('personalizedCertification')} />
          <Label htmlFor="personalizedCertification" className="cursor-pointer">
            Add Natal Chart Seal (+ ₹250)
          </Label>
        </div>

        {isPersonalized && (
          <div className="space-y-4 p-4 bg-[#FAF7F2] border border-[#EAE6DF] rounded-lg">
            <Label htmlFor="certName">Full Name (for certificate)</Label>
            <Input id="certName" placeholder="Priyan Sharma" {...register('birthDetails.name')} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="certBirthDate">Birth Date</Label>
                <Input id="certBirthDate" type="date" {...register('birthDetails.birthDate')} />
              </div>

              <div>
                <Label htmlFor="certBirthTime">Birth Time (optional)</Label>
                <Input id="certBirthTime" type="time" {...register('birthDetails.birthTime')} />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="certBirthPlace">Birth Place (optional)</Label>
                <Input
                  id="certBirthPlace"
                  placeholder="Mumbai, India"
                  {...register('birthDetails.birthPlace')}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[#EAE6DF] pt-6 space-y-4">
        <Label className="font-medium">Payment Method</Label>
        <Select {...register('paymentMethod')}>
          <option value="razorpay">Razorpay (UPI, Cards, Net Banking)</option>
          <option value="cod">Cash on Delivery (Select PIN codes only)</option>
        </Select>

        <Button type="submit" className="w-full" size="xl">
          Place Order
        </Button>
      </div>
    </form>
  );
}
