import '../styles/PokemonSlot.scss';
import { useEffect, useState } from 'react';

export default function PokemonSlot({ poke, index, tiposNaturaleza, items, actualizarStat, eliminarPokemon, poderes = [] }) {
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
    const naturaleza = tiposNaturaleza.find(n => n.id === parseInt(poke.naturalezaId));
    setBoostStat(naturaleza?.afectaStatPos || null);
    setNerfStat(naturaleza?.afectaStatNeg || null);
  }, [poke.naturalezaId, tiposNaturaleza]);

  useEffect(() => {
    const item = items.find(i => i.id === poke.itemId);
    setItemSeleccionado(item || null);
  }, [poke.itemId, items]);

  const statBaseMap = {
    hp: poke.hp,
    attack: poke.attack,
    defense: poke.defense,
    spAtk: poke.spAtk,
    spDef: poke.spDef,
    speed: poke.speed
  };

  const getStatTotal = (key, evKey, ivKey) => {
    let total = (statBaseMap[key] || 0) + (Number(poke[evKey]) || 0) + (Number(poke[ivKey]) || 0);
    if (key === boostStat) total += 5;
    if (key === nerfStat) total -= 5;
    return total;
  };

  const getStatClass = (statKey) => {
    if (statKey === boostStat) return 'iv-input boost';
    if (statKey === nerfStat) return 'iv-input nerf';
    return 'iv-input';
  };

  const handleEVChange = (stat, value) => {
    const val = Math.min(204, Math.max(0, parseInt(value) || 0));
    actualizarStat(index, stat, val);
  };

  const handleIVChange = (stat, value) => {
    const val = Math.min(31, Math.max(0, parseInt(value) || 0));
    actualizarStat(index, stat, val);
  };

  const handleNaturalezaChange = (e) => {
    actualizarStat(index, 'naturalezaId', parseInt(e.target.value));
  };

  const handleNombreChange = (e) => {
    actualizarStat(index, 'nombre', e.target.value);
  };

  return (
    <div className="pokemon-slot">
      <div className="slot-header">
        <input type="text" value={poke.nombre || ''}onChange={handleNombreChange}
          className="nombre-pokemon-input"
          placeholder="Nombre"
        />
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

      <div className="tipo-texto">
        Tipo: <strong>{poke.tipo}</strong>
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

        <label>IVs (0–31)</label>
        <div className="ivs-row">
          {[{ k: 'ivHp', s: 'hp' }, { k: 'ivAtk', s: 'attack' }, { k: 'ivDef', s: 'defense' }, { k: 'ivSpAtk', s: 'spAtk' }, { k: 'ivSpDef', s: 'spDef' }, { k: 'ivSpeed', s: 'speed' }]
            .map(({ k, s }) => (
              <input
                key={k}
                type="number"
                placeholder={k}
                className={getStatClass(s)}
                value={poke[k] === 0 ? '' : poke[k]}
                onChange={(e) => handleIVChange(k, e.target.value)}
                min={0}
                max={31}
              />
            ))}
        </div>

        <select
          value={poke.naturalezaId || ''}
          onChange={handleNaturalezaChange}
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

        <div className="poderes-section">
          <label>Poder único:</label>
          <input type="text" value={poke.poderU || ''} readOnly />

          {[1, 2, 3].map(n => (
            <div key={n}>
              <label>{`Poder ${n}:`}</label>
              <select
                value={poke[`poder${n}Id`] || ''}
                onChange={(e) => actualizarStat(index, `poder${n}Id`, e.target.value)}
              >
                <option value="">Seleccionar poder</option>
                {poderes.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="stat-final-section">
        <h5>Stats Finales</h5>
        <table>
          <thead>
            <tr>
              <th>Stat</th>
              <th>Base</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {[{ name: 'HP', key: 'hp', ev: 'evHp', iv: 'ivHp' },
              { name: 'Atk', key: 'attack', ev: 'evAtk', iv: 'ivAtk' },
              { name: 'Def', key: 'defense', ev: 'evDef', iv: 'ivDef' },
              { name: 'SpAtk', key: 'spAtk', ev: 'evSpAtk', iv: 'ivSpAtk' },
              { name: 'SpDef', key: 'spDef', ev: 'evSpDef', iv: 'ivSpDef' },
              { name: 'Speed', key: 'speed', ev: 'evSpeed', iv: 'ivSpeed' }]
              .map(({ name, key, ev, iv }) => (
                <tr key={key}>
                  <td>{name}</td>
                  <td>{statBaseMap[key]}</td>
                  <td>{getStatTotal(key, ev, iv)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
