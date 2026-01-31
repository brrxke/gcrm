import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Star, Gift } from 'lucide-react';

export function FeedbackSurvey() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black p-4 lg:p-8 pb-24 lg:pb-8 flex items-center justify-center">
        <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl text-white mb-4">Thank You!</h2>
          <p className="text-muted-foreground mb-6">
            Your feedback helps us improve. As a token of appreciation, enjoy 10% off your next membership renewal.
          </p>
          <div className="bg-black/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Promo Code</p>
            <p className="text-2xl text-primary tracking-wider">THANKS10</p>
          </div>
          <Button
            onClick={() => setSubmitted(false)}
            className="bg-primary hover:bg-primary/90 text-black"
          >
            Submit Another Review
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-white mb-2 uppercase tracking-wider">Share Your Experience</h1>
          <p className="text-muted-foreground">Your feedback matters</p>
        </div>

        {/* Rating */}
        <Card className="bg-card border-border p-8">
          <h3 className="text-white mb-6 text-center">How was your experience?</h3>
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm">
            {rating === 0 && 'Select a rating'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </p>
        </Card>

        {/* Feedback Text */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-white mb-4">Tell us more</h3>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What did you like? What can we improve?"
            className="bg-input border-border text-white min-h-[150px] resize-none"
          />
        </Card>

        {/* Categories */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-white mb-4">Rate specific aspects</h3>
          <div className="space-y-4">
            {[
              'Equipment Quality',
              'Cleanliness',
              'Staff Friendliness',
              'Class Variety',
              'Value for Money'
            ].map((category) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-white">{category}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-muted-foreground hover:fill-primary hover:text-primary cursor-pointer transition-colors"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Special Offer Banner */}
        <Card className="bg-gradient-to-r from-secondary/20 to-primary/20 border-secondary/50 p-6">
          <div className="flex items-start gap-4">
            <Gift className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-white mb-2">Special Offer</h3>
              <p className="text-muted-foreground text-sm">
                Complete this survey and get 10% off your next membership renewal
              </p>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary/90 text-black h-12"
        >
          Submit Feedback
        </Button>
      </div>
    </div>
  );
}
