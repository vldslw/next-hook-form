export default function SubmitButton({ isSubmitting }) {
  return (
    <button disabled={isSubmitting} type="submit" className="submit-button">
      Далее
    </button>
  );
}
