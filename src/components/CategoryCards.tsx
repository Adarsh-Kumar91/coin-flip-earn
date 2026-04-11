import { categoryCards } from "@/data/tasks";

const icons = ["⚡", "🎯", "🏆"];

const CategoryCards = () => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
      {categoryCards.map((card, i) => (
        <div
          key={i}
          className="min-w-[160px] bg-card rounded-xl p-4 flex flex-col items-center gap-3"
        >
          <span className="text-4xl">{icons[i]}</span>
          <p className="text-xs text-center text-muted-foreground">{card.name}</p>
          <div
            className="w-full text-center py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: "var(--gold-gradient)", color: "hsl(var(--background))" }}
          >
            {card.label} 🪙 {card.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryCards;
