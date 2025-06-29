import '../styles/PokemonSlot.scss';
import { useEffect, useState } from 'react';

export default function PokemonSlot({ poke, index, tiposNaturaleza, items, actualizarStat, eliminarPokemon }) {
  const [totalEV, setTotalEV] = useState(0);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [boostStat, setBoostStat] = useState(null);
  const [nerfStat, setNerfStat] = useState(null);

  useEffect(() => {
    const total = ['evHp', 'evAtk', 'evDef', 'evSpAtk', 'evSpDef', 'evSpeed']
      .map(stat => Number(poke[stat]) || 0)
      .reduce((a, b) => a + b, 0);
    setTotalEV(total);
  }, [poke]);

  useEffect(() => {
    const naturaleza = tiposNaturaleza.find(n => n.id === poke.naturalezaId);
    setBoostStat(naturaleza?.afectaStatPos || null);
    setNerfStat(naturaleza?.afectaStatNeg || null);
  }, [poke.naturalezaId, tiposNaturaleza]);

  useEffect(() => {
    const item = items.find(i => i.id === poke.itemId);
    setItemSeleccionado(item || null);
  }, [poke.itemId, items]);

  const handleEVChange = (stat, value) => {
    const val = Math.min(204, Math.max(0, parseInt(value) || 0));
    actualizarStat(index, stat, val);
  };

  const handleIVChange = (stat, value) => {
    const val = Math.min(31, Math.max(0, parseInt(value) || 0));
    actualizarStat(index, stat, val);
  };

  const statBaseMap = {
    hp: poke.hp,
    attack: poke.attack,
    defense: poke.defense,
    spAtk: poke.spAtk,
    spDef: poke.spDef,
    speed: poke.speed
  };

  const getStatClass = (statKey) => {
    if (statKey === boostStat) return 'iv-input boost';
    if (statKey === nerfStat) return 'iv-input nerf';
    return 'iv-input';
  };

  return (
    <div className="pokemon-slot">
      <div className="slot-header">
        <h4>{poke.nombre}</h4>
        <button type="button" onClick={() => eliminarPokemon(index)}>X</button>
      </div>

      <div className="image-row">
        {itemSeleccionado?.imagen && (
          <img
            src={itemSeleccionado.imagen.startsWith('http') ? itemSeleccionado.imagen : `http://localhost:3000${itemSeleccionado.imagen}`}
            alt={itemSeleccionado.nombre}
            className="item-img"
          />
        )}
        <img
          src={poke.imagen.startsWith('http') ? poke.imagen : `http://localhost:3000${poke.imagen}`}
          alt={poke.nombre}
          className="pokemon-img"
        />
      </div>

      <div className="stats">
        <label>EVs restantes: {508 - totalEV}</label>
        {['evHp', 'evAtk', 'evDef', 'evSpAtk', 'evSpDef', 'evSpeed'].map(stat => (
          <input
            key={stat}
            type="number"
            placeholder={stat}
            value={poke[stat] === 0 ? '' : poke[stat]}
            onChange={(e) => handleEVChange(stat, e.target.value)}
            min={0}
            max={204}
          />
        ))}

        <label>IVs (0–31) con base</label>
        <div className="ivs-row">
          {[
            { key: 'ivHp', statKey: 'hp' },
            { key: 'ivAtk', statKey: 'attack' },
            { key: 'ivDef', statKey: 'defense' },
            { key: 'ivSpAtk', statKey: 'spAtk' },
            { key: 'ivSpDef', statKey: 'spDef' },
            { key: 'ivSpeed', statKey: 'speed' }
          ].map(({ key, statKey }) => (
            <div key={key} className="iv-with-stat">
              <input
                type="number"
                placeholder={key}
                className={getStatClass(statKey)}
                value={poke[key] === 0 ? '' : poke[key]}
                onChange={(e) => handleIVChange(key, e.target.value)}
                min={0}
                max={31}
              />
              <span className="stat-final">{statBaseMap[statKey]}</span>
            </div>
          ))}
        </div>

        <select
          value={poke.naturalezaId || ''}
          onChange={(e) => actualizarStat(index, 'naturalezaId', e.target.value)}
        >
          <option value="">Naturaleza</option>
          {tiposNaturaleza.map(n => (
            <option key={n.id} value={n.id}>{n.nombre}</option>
          ))}
        </select>

        <select
          value={poke.itemId || ''}
          onChange={(e) => actualizarStat(index, 'itemId', e.target.value)}
        >
          <option value="">Item</option>
          {items.map(i => (
            <option key={i.id} value={i.id}>{i.nombre}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
