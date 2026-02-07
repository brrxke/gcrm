import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Star, Gift } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

export function FeedbackSurvey() {
  const { t } = useI18n();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      alert(t('feedback', 'selectRatingAlert'));
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
          <h2 className="text-2xl text-white mb-4">{t('feedback', 'thankYou')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('feedback', 'thankYouDesc')}
          </p>
          <div className="bg-black/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">{t('feedback', 'promoCode')}</p>
            <p className="text-2xl text-primary tracking-wider">THANKS10</p>
          </div>
          <Button
            onClick={() => setSubmitted(false)}
            className="bg-primary hover:bg-primary/90 text-black"
          >
            {t('feedback', 'submitAnother')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-white mb-2 uppercase tracking-wider">{t('feedback', 'title')}</h1>
          <p className="text-muted-foreground">{t('feedback', 'subtitle')}</p>
        </div>

        {/* Rating */}
        <Card className="bg-card border-border p-8">
          <h3 className="text-white mb-6 text-center">{t('feedback', 'experienceQuestion')}</h3>
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
            {rating === 0 && t('feedback', 'ratingNone')}
            {rating === 1 && t('feedback', 'rating1')}
            {rating === 2 && t('feedback', 'rating2')}
            {rating === 3 && t('feedback', 'rating3')}
            {rating === 4 && t('feedback', 'rating4')}
            {rating === 5 && t('feedback', 'rating5')}
          </p>
        </Card>

        {/* Feedback Text */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-white mb-4">{t('feedback', 'tellMore')}</h3>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={t('feedback', 'placeholder')}
            className="bg-input border-border text-white min-h-[150px] resize-none"
          />
        </Card>

        {/* Categories */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-white mb-4">{t('feedback', 'rateAspects')}</h3>
          <div className="space-y-4">
            {[
              'aspectEquipment',
              'aspectCleanliness',
              'aspectStaff',
              'aspectClasses',
              'aspectValue'
            ].map((categoryKey) => (
              <div key={categoryKey} className="flex items-center justify-between">
                <span className="text-white">{t('feedback', categoryKey)}</span>
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
              <h3 className="text-white mb-2">{t('feedback', 'specialOffer')}</h3>
              <p className="text-muted-foreground text-sm">
                {t('feedback', 'specialOfferDesc')}
              </p>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary/90 text-black h-12"
        >
          {t('feedback', 'submit')}
        </Button>
      </div>
    </div>
  );
}
